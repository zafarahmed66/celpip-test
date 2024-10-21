import { createContext, useContext, ReactNode, useState } from "react";
import { ListeningTest } from "@/types/listening";
import { useTestContext } from "./TestContext";
import { attemptTest, fetchAttempt } from "@/services/testService";
import { toast } from "sonner";

interface ListeningContextType {
  listeningData: ListeningTest | undefined;
  userAnswers: number[];
  setUserAnswer: (index: number, answer: number) => void;
  fetchListeningData: () => void;
}

const ListeningContext = createContext<ListeningContextType | undefined>(
  undefined
);

export const ListeningProvider = ({ children }: { children: ReactNode }) => {
  const { currentTest, setAttemptId, attemptId, moduleIds, attemptTestData, setAttemptTestData} = useTestContext();
  const [listeningData, setListeningData] = useState<ListeningTest>();
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const setUserAnswer = (index: number, answer: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };


  const fetchListeningData = async () => {
    const module = currentTest?.modules.find(
      (module) => module.type === "Listening"
    );
    if (module) {
      setUserAnswers(new Array(module.pages.length).fill(-1));
    }
    try {
      if (currentTest && module) {
        let currentAttempt = attemptId;
        if (!currentAttempt) {
          const { _id } = await attemptTest(currentTest?._id, moduleIds);
          setAttemptId(_id);
          currentAttempt = _id;
        }

        const data = await fetchAttempt(
          currentAttempt || "",
          "Listening",
          attemptTestData,
          setAttemptTestData
        );
        setListeningData(data);
      }
      
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <ListeningContext.Provider
      value={{ listeningData, userAnswers, setUserAnswer, fetchListeningData }}
    >
      {children}
    </ListeningContext.Provider>
  );
};

export const useListeningContext = () => {
  const context = useContext(ListeningContext);
  if (!context) {
    throw new Error(
      "useListeningContext must be used within a ListeningProvider"
    );
  }
  return context;
};

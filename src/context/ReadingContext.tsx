import {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import { ReadingTest } from "@/types/reading";
import { useTestContext } from "./TestContext";
import { attemptTest, fetchAttempt } from "@/services/testService";
import { toast } from "sonner";

interface ReadingContextType {
  readingData: ReadingTest | undefined;
  userAnswers: number[];
  setUserAnswer: (index: number, answer: number) => void;
  fetchReadingData: () => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const ReadingProvider = ({ children }: { children: ReactNode }) => {
  const { currentTest, attemptId, setAttemptId, moduleIds, attemptTestData, setAttemptTestData } = useTestContext();
  const [readingData, setReadingData] = useState<ReadingTest>();

  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const setUserAnswer = (index: number, answer: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const fetchReadingData = async () => {
    const module = currentTest?.modules.find(
      (module) => module.type === "Reading"
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
        const data = await fetchAttempt(currentAttempt || "", "Reading", attemptTestData, setAttemptTestData);
        setReadingData(data);
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <ReadingContext.Provider
      value={{ readingData, userAnswers, setUserAnswer, fetchReadingData }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error("useReadingContext must be used within a ReadingProvider");
  }
  return context;
};

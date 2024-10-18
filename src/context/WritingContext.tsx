import {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import { WritingTest } from "@/types/writing";
import { useTestContext } from "./TestContext";
import { attemptTest, fetchAttempt } from "@/services/testService";
import { toast } from "sonner";

interface WritingContextType {
  writingData: WritingTest | undefined;
  fetchWritingData: () => void;
}

const WritingContext = createContext<WritingContextType | undefined>(undefined);

export const WritingProvider = ({ children }: { children: ReactNode }) => {
  const { currentTest, attemptId, setAttemptId, moduleIds, attemptTestData, setAttemptTestData } = useTestContext();
  const [writingData, setWritingData] = useState<WritingTest>();

   const fetchWritingData = async () => {
     const module = currentTest?.modules.find(
       (module) => module.type === "Writing"
     );
  
     try {
       if (currentTest && module) {
         let currentAttempt = attemptId;
         if (!currentAttempt) {
           const { _id } = await attemptTest(currentTest?._id, moduleIds);
           setAttemptId(_id);
           currentAttempt = _id;
         }
         const data = await fetchAttempt(currentAttempt || "", "Writing", attemptTestData, setAttemptTestData);
         setWritingData(data);
       }
     } catch {
       toast.error("Something went wrong!");
     }
   };

  return (
    <WritingContext.Provider value={{ writingData, fetchWritingData }}>
      {children}
    </WritingContext.Provider>
  );
};

export const useWritingContext = () => {
  const context = useContext(WritingContext);
  if (!context) {
    throw new Error("useWritingContext must be used within a WritingProvider");
  }
  return context;
};

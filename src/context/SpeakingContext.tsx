import {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import { SpeakingTest } from "@/types/speaking";
import { useTestContext } from "./TestContext";
import { attemptTest, fetchAttempt } from "@/services/testService";
import { toast } from "sonner";

interface SpeakingContextType {
  speakingData: SpeakingTest | undefined;
  startAudio: string;
  endAudio: string;
  fetchSpeakingData: () => void;
}

const SpeakingContext = createContext<SpeakingContextType | undefined>(
  undefined
);

export const SpeakingProvider = ({ children }: { children: ReactNode }) => {
  const { currentTest, attemptId, setAttemptId, moduleIds, attemptTestData, setAttemptTestData } = useTestContext();
  const [speakingData, setSpeakingData] = useState<SpeakingTest>();
  const startAudio =
    "https://instructionalproducts.paragontesting.ca/InstructionalProducts/Areas/FreeOnlineSampleTest/Content/audio/S_Speaking_Start.ogg";
  const endAudio =
    "https://instructionalproducts.paragontesting.ca/InstructionalProducts/Areas/FreeOnlineSampleTest/Content/audio/S_Speaking_Stop.ogg";

    const fetchSpeakingData = async () => {
      const module = currentTest?.modules.find(
        (module) => module.type === "Speaking"
      );

      try {
        if (currentTest && module) {
          let currentAttempt = attemptId;
          if (!currentAttempt) {
            const { _id } = await attemptTest(currentTest?._id, moduleIds);
            setAttemptId(_id);
            currentAttempt = _id;
          }
          const data = await fetchAttempt(currentAttempt || "", "Speaking", attemptTestData, setAttemptTestData);
          setSpeakingData(data);
        }
      } catch {
        toast.error("Something went wrong!");
      }
    };

  return (
    <SpeakingContext.Provider value={{ speakingData, startAudio, endAudio, fetchSpeakingData }}>
      {children}
    </SpeakingContext.Provider>
  );
};

export const useSpeakingContext = () => {
  const context = useContext(SpeakingContext);
  if (!context) {
    throw new Error("useSpeakingContext must be used within a ReadingProvider");
  }
  return context;
};

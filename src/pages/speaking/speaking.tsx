import CardLayout from "@/components/card-layout";
import InsructionHeader from "@/components/instruction-header";
import InstructionItem from "@/components/instruction-item";
import InstructionVideo from "@/components/instruction-video";
import { useSpeakingContext } from "@/context/SpeakingContext";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import SpeakingTest from "./components/speaking-test";
import DescribingImage from "./components/describing-image";
import ComparingImage from "./components/comparing-image";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTestContext } from "@/context/TestContext";
import { getNextModule } from "@/lib/utils";

export default function Speaking() {
  const { sectionId } = useParams();
  const { pathname } = useLocation();

  const { speakingData, fetchSpeakingData } = useSpeakingContext();
  const { tests, attemptId, currentTest, setCurrentTest } =
    useTestContext();
  

  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId && tests) {
      const currentTest = tests.find((test) => test._id === testId) || tests[0];
      if (currentTest) {
        setCurrentTest(currentTest);
      }
    }
  }, [testId, tests]);

  useEffect(() => {
    if (currentTest) {
      fetchSpeakingData();
    }
  }, [currentTest]);

  if (!speakingData) return <div>Loading...</div>;

  const id = parseInt(sectionId!);
  const section = speakingData.pages[id - 1];

  
  if (!section) {
    const nextModule = getNextModule("speaking", currentTest!);
    if (nextModule === "/") {
      toast.success("All test are completed!");
      return <Navigate to="/" />;
    }
    return (
      <Navigate
        to={`/${nextModule}/1?testId=${currentTest?._id}&attemptId=${attemptId}`}
        state={{
          prevPage: pathname,
        }}
      />
    );
  }

  const next = `/speaking/${id + 1}?testId=${currentTest?._id}&attemptId=${attemptId}`;

 
  
  

  return (
    <CardLayout
      recordingTime={section.recordingTime ? section.recordingTime : undefined}
      timer={section.prepTime ? section.prepTime : undefined}
      title={section.title}
      prevLink={pathname}
      nextLink={next}
      isSpeakingTest={true}
    >
      <div className="min-h-[75vh] overflow-y-scroll">
        {!section.questionSets &&
          section.instructions &&
          section.instructions[0].text && (
            <InsructionHeader text={section.instructions[0].text!} />
          )}
        {section.instructions &&
          section.instructions &&
          section.instructions.length > 0 &&
          section.instructions?.[0].video && (
            <InstructionVideo videoSrc={section.instructions[0].video} />
          )}
        {section.instructions && section.instructions.length > 1 && (
          <InstructionItem instructions={section.instructions.slice(1)} />
        )}

        {section.description && section.questionSets && (
          <>
            <div className="px-8 py-6">
              <DescribingImage
                title={section.questionSets[0].questions[0].text}
                preparationTime={section.prepTime!}
                recordingTime={section.recordingTime!}
                imageUrl={section.description}
              />
            </div>
          </>
        )}

        {section.questionSets &&
          section.questionSets[0].questions[0].type === "mcq" && (
            <>
              <div className="px-8 py-6">
                <ComparingImage
                  prepartionTime={section.prepTime!}
                  recordingTime={section.recordingTime!}
                  selectionTime={section.prepTime!}
                  comparison={
                    section?.questionSets[0]?.questions[0]?.defaultAnswer
                      ?.choice
                  }
                  question={section.questionSets[0].questions[0]}
                />
              </div>
            </>
          )}

        {!section.description &&
          section.questionSets &&
          section.questionSets[0].questions[0].type === "simple" && (
            <>
              <div className="px-8 py-6">
                <SpeakingTest
                  preparationTime={section.prepTime!}
                  recordingTime={
                    section.recordingTime ? section.recordingTime : 0
                  }
                  title={section.questionSets[0].questions[0].text}
                  additionalInfo={section.questionSets[0].instructions}
                />
              </div>
            </>
          )}
      </div>
    </CardLayout>
  );
}

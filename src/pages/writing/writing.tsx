import CardLayout from "@/components/card-layout";
import InsructionHeader from "@/components/instruction-header";
import InstructionItem from "@/components/instruction-item";
import InstructionVideo from "@/components/instruction-video";
import { useWritingContext } from "@/context/WritingContext";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import SimpleQuesion from "./components/simple-question";
import { ScenarioSection } from "./components/scenario-section";
import { MCQQuestion } from "./components/mcq-question";
import { useEffect, useState } from "react";
import { getNextModule } from "@/lib/utils";
import { useTestContext } from "@/context/TestContext";
import { toast } from "sonner";

export default function Writing() {
  const { sectionId } = useParams();
  const { pathname } = useLocation();

  const { writingData, fetchWritingData } = useWritingContext();
  const { currentTest, attemptId, tests, setCurrentTest } = useTestContext();
  const id = parseInt(sectionId!);
  const section = writingData?.pages[id - 1];
  const [timer, setTimer] = useState<number | undefined>(
    section?.duration || undefined
  );
  
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
      fetchWritingData();
    }
  }, [currentTest]);
  
  useEffect(() => {
    setTimer(section?.duration)
  }, [section])
  
  const next = `/writing/${id + 1}?testId=${currentTest?._id}&attemptId=${attemptId}`;

  const navigator = useNavigate();

  useEffect(() => {
    if (section?.duration) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            navigator(next);
            return undefined;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [next, navigator]);

  if (!writingData) {
    return <div>Loading...</div>;
  }

  if (!section) {
    const nextModule = getNextModule("writing", currentTest!);
    if (nextModule === "/") {
      toast.success("All test are completed!")
      return <Navigate to="/" />
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


  return (
    <CardLayout
      timer={timer}
      title={section.title}
      prevLink={pathname}
      nextLink={next}
    >
      <div className="min-h-[75vh]">
        {section.instructions &&
          Array.isArray(section.instructions) &&
          !section.questionSets &&
          section.instructions.length > 0 && (
            <>
              {section.instructions[0].text && (
                <InsructionHeader text={section.instructions[0]?.text || ""} />
              )}
              {section.instructions[0]?.video && (
                <InstructionVideo videoSrc={section.instructions[0].video} />
              )}
              {section.instructions.length > 1 && (
                <InstructionItem instructions={section.instructions.slice(1)} />
              )}
            </>
          )}

        {section.questionSets && Array.isArray(section.questionSets) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <ScenarioSection
                scenarioInfo={section.instructions[0]?.text || ""}
                content={section.description!}
              />
              {section.questionSets[0].questions[0].type === "simple" && (
                <SimpleQuesion
                  questionInfo={section.questionSets[0].questions[0].text}
                  instructions={section.questionSets[0].instructions || []}
                />
              )}
              {section.questionSets[0].questions[0].type === "mcq" && (
                <MCQQuestion
                  questionInfo={section.questionSets[0].questions[0].text}
                  options={section.questionSets[0].questions[0].choices!}
                />
              )}
            </div>
          </>
        )}
      </div>
    </CardLayout>
  );
}

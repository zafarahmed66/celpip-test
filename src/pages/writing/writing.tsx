import CardLayout from "@/components/card-layout";
import InsructionHeader from "@/components/instruction-header";
import InstructionItem from "@/components/instruction-item";
import InstructionVideo from "@/components/instruction-video";
import { useWritingContext } from "@/context/WritingContext";
import { Navigate, useLocation, useParams } from "react-router-dom";
import SimpleQuesion from "./components/simple-question";
import { ScenarioSection } from "./components/scenario-section";
import { MCQQuestion } from "./components/mcq-question";
import { useEffect, useState } from "react";

export default function Writing() {
  const { sectionId } = useParams();
  const { pathname } = useLocation();

  const { writingData, fetchWritingData } = useWritingContext();
  const id = parseInt(sectionId!);
  const section = writingData?.pages[id - 1];
  const [timer, setTimer] = useState<number | undefined>(
    section?.duration || undefined
  );

  useEffect(() => {
    fetchWritingData();
  }, []);
  
  useEffect(() => {
    setTimer(section?.duration)
  }, [section])
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          return undefined;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!writingData) {
    return <div>Loading...</div>;
  }

  if (!section) {
    return (
      <Navigate
        to={"/speaking/1"}
        state={{
          prevPage: pathname,
        }}
      />
    );
  }

  const next = `/writing/${id + 1}`;

  return (
    <CardLayout
      timer={timer}
      title={section.title}
      prevLink={pathname}
      nextLink={next}
    >
      <div className="min-h-[75vh] overflow-y-scroll">
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

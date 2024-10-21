/* eslint-disable react-hooks/rules-of-hooks */
import CardLayout from "@/components/card-layout";
import InstructionHeader from "@/components/instruction-header";
import InstructionItem from "@/components/instruction-item";
import InstructionVideo from "@/components/instruction-video";
import { useReadingContext } from "@/context/ReadingContext";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { ReadingPassage } from "./components/reading-passage";
import { QuestionSet } from "./components/question-set";
import { useTestContext } from "@/context/TestContext";

export default function Reading() {
  const { sectionId } = useParams();
  const { pathname } = useLocation();
  const { readingData, fetchReadingData } = useReadingContext();
  const { currentTest } = useTestContext();
  const id = parseInt(sectionId!);
  const section = readingData?.pages[id - 1];
  
  const [timer, setTimer] = useState<number | undefined>(
    section?.duration || undefined
  );

  useEffect(() => {
    if (currentTest) { 
      fetchReadingData();
    }
  }, [currentTest])
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev) {
          if (prev <= 0) return 0;
          return prev - 1;
        } else {
          return undefined;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!readingData) {
    return <div>Loading...</div>
  }

  const next = `/reading/${id + 1}`;

  if (!section) {
    return (
      <Navigate
        to={"/reading/answer-key"}
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
      hasAnswerKey={section.questionSets !== undefined || false}
    >
      <div className="min-h-[75vh] overflow-y-scroll">
        {!section.questionSets &&
          section.instructions &&
          section.instructions[0].text && (
            <InstructionHeader text={section.instructions[0].text!} />
          )}
        {section.instructions &&
          section.instructions.length > 0 &&
          section.instructions?.[0].video && (
            <InstructionVideo
              description={section.description || undefined}
              videoSrc={section.instructions?.[0].video}
            />
          )}
        {section.instructions && section.instructions.length > 1 && (
          <InstructionItem instructions={section.instructions.slice(1)} />
        )}

        {section.questionSets && (
          <div className="grid gird-cols-1 md:grid-cols-2">
            <ReadingPassage
              content={section.description || ""}
              passageInfo={
                (section.instructions &&
                  section.instructions.length > 0 &&
                  section.instructions?.[0].text) ||
                ""
              }
            />
            <div className="p-4 space-y-6 border-l border-gray-300 bg-customSkyBlue h-[75vh] overflow-y-scroll">
              {section.questionSets.map((question, index) => (
                <QuestionSet
                  key={index}
                  questions={question.questions}
                  questionInfo={question.instructions?.[0]?.text || ""}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CardLayout>
  );
}

import CardLayout from "@/components/card-layout";
import InstructionHeader from "@/components/instruction-header";
import InstructionItem from "@/components/instruction-item";
import InstructionVideo from "@/components/instruction-video";
import { useListeningContext } from "@/context/ListeningContext";
import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AudioSection from "./components/audio-section";
import QuestionSection from "./components/question-section";
import Preparation from "./components/preparation";
import QuestionnaireComponent from "./components/questionnaire";
import { useTestContext } from "@/context/TestContext";

export default function Listening() {
  const { sectionId } = useParams();
  const { pathname } = useLocation();
  const { listeningData, fetchListeningData } = useListeningContext();
  const { tests, attemptId, currentTest, setCurrentTest } = useTestContext();

  const id = parseInt(sectionId!);
  const section = listeningData?.pages[id - 1];

  const [timer, setTimer] = useState<number | undefined>(
    section?.duration || undefined
  );

  const [enableNext, setEnableNext] = useState(true);

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
      fetchListeningData();
    }
  }, [currentTest]);

  useEffect(() => {
    if (section) {
      setTimer(section.duration || undefined);
      if (
        section.questionSets &&
        section.questionSets[0].questions.length <= 1 &&
        section.questionSets[0].questions[0].type === "mcq"
      ) {
        setEnableNext(false);
      } else {
        setEnableNext(true);
      }
    }
  }, [section]);
  const next = `/listening/${id + 1}?testId=${currentTest?._id}&attemptId=${attemptId}`;
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

  if (!listeningData) {
    return <div>Loading...</div>;
  }

  if (!section) {
    return (
      <Navigate
        to={`/listening/answer-key?testId=${currentTest?._id}&attemptId=${attemptId}`}
        state={{ prevPage: pathname }}
      />
    );
  }

  return (
    <CardLayout
      enableNext={enableNext}
      timer={timer}
      title={section.title}
      prevLink={pathname}
      nextLink={next}
      hasAnswerKey={!!section.questionSets}
    >
      <div className="min-h-[75vh] overflow-y-scroll">
        {!section.questionSets &&
          section.instructions &&
          section.instructions[0]?.text && (
            <InstructionHeader text={section.instructions[0].text!} />
          )}
        {section.instructions && section.instructions[0]?.video && (
          <InstructionVideo
            description={section.description || undefined}
            videoSrc={section.instructions[0].video}
          />
        )}
        {!section.questionSets &&
          section.instructions &&
          section.instructions.length > 1 && (
            <InstructionItem instructions={section.instructions.slice(1)} />
          )}
        {section.prepTime && (
          <Preparation
            info={section.description!}
            time={section.prepTime}
            next={next}
          />
        )}
        {section.instructions && section.instructions[0]?.audio && (
          <div className="flex text-lg justify-evenly text-customLightBlue">
            <AudioSection
              audioInfo={section.description || ""}
              audioUrl={section.instructions[0].audio}
            />
          </div>
        )}
        {section.questionSets &&
          section.questionSets[0].questions.length > 1 && (
            <QuestionnaireComponent
              questions={section.questionSets[0].questions}
              sectionTitle={section.title}
            />
          )}
        {section.questionSets &&
          section.questionSets[0].questions[0].type === "mcq" &&
          section.questionSets &&
          section.questionSets[0].questions.length <= 1 && (
            <div className="flex text-lg justify-evenly text-customLightBlue">
              <AudioSection
                audioInfo={section.instructions?.[0]?.text || ""}
                setEnableNext={setEnableNext}
                audioUrl={section.questionSets[0].questions[0].text}
              />
              <QuestionSection
                key={section.questionSets[0].questions[0]._id}
                questionId={section.questionSets[0].questions[0]._id}
                title={section.title}
                question={section.questionSets[0].instructions?.[0]?.text || ""}
                options={section.questionSets[0].questions[0].choices!}
                setEnableNext={setEnableNext}
              />
            </div>
          )}
      </div>
    </CardLayout>
  );
}

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Choice } from "@/types/listening";
import {
  countQuestionsBySectionTitle,
  getFlattenedQuestionIndexListening,
  getQuestionIndex,
} from "@/lib/utils";
import { useListeningContext } from "@/context/ListeningContext";

interface QuestionSectionProps {
  question: string;
  options: Choice[];
  title: string;
  questionId: string;
  setEnableNext: (value: boolean) => void;
}

const QuestionSection = ({
  options,
  question,
  title,
  questionId,
  setEnableNext,
}: QuestionSectionProps) => {
  const { listeningData, setUserAnswer } = useListeningContext();
  if (!listeningData) {
    return <div>Loading...</div>;
  }

  const totalQuestions = countQuestionsBySectionTitle(listeningData, title);
  const currentQuestion = getQuestionIndex(listeningData, title, questionId);
  const questionIndex = getFlattenedQuestionIndexListening(
    listeningData,
    title,
    questionId
  );

  const handleAnswerChange = (value: string) => {
    const selectedIndex = options.findIndex(
      (option) => option.image === value || option.text === value
    );

    setEnableNext(true);

    if (questionIndex != -1) {
      setUserAnswer(questionIndex!, selectedIndex);
    } else {
      setUserAnswer(-1, selectedIndex);
    }
  };

  return (
    <div className="border-l flex-1 pt-4 bg-customSkyBlue px-6 min-h-[75vh] text-sm md:text-base">
      <div className="mb-4 text-sm text-gray-600">
        {`Question ${currentQuestion} of ${totalQuestions}`}
      </div>
      <div className="flex items-start gap-2 mb-4 tracking-tight">
        <Info className="self-start mt-[2px]" />
        <h3 className="leading-tight">{question}</h3>
      </div>

      <RadioGroup onValueChange={handleAnswerChange}>
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className="flex items-center py-2 ml-8 space-x-2 border-b border-gray-300 border-dotted hover:bg-customGreen"
            >
              <RadioGroupItem
                value={option.text! || option.image!}
                id={option.text || option.image}
              />
              {option.text && (
                <Label
                  className="text-xs cursor-pointer md:text-base"
                  htmlFor={option.text}
                >
                  {option.text}
                </Label>
              )}
              {option.image && (
                <Label className="cursor-pointer" htmlFor={option.image}>
                  <img
                    src={option.image}
                    className="md:w-44 w-22"
                    alt="option"
                  />
                </Label>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
export default QuestionSection;

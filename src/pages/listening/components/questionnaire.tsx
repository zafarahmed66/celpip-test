import React from "react";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Choice, Question } from "@/types/listening";
import { useListeningContext } from "@/context/ListeningContext";
import { getFlattenedQuestionIndexListening } from "@/lib/utils";

interface QuestionnaireComponentProps {
  questions: Question[];
  sectionTitle: string;
}

const QuestionnaireComponent = ({
  questions,
  sectionTitle,
}: QuestionnaireComponentProps) => {
  const { setUserAnswer, listeningData } = useListeningContext();

  const handleChange = (
    value: string,
    questionText: string,
    options: Choice[]
  ) => {
    if (!listeningData) return <div>Loading...</div>;
    const questionIndex = getFlattenedQuestionIndexListening(
      listeningData,
      sectionTitle,
      questionText
    );

    const selectedIndex = options.findIndex((option) => option.text === value);

    setUserAnswer(questionIndex || -1, selectedIndex);
  };

  return (
    <div className="p-6 bg-customSkyBlue min-h-[75vh]">
      <div className="flex items-center gap-2 mb-4 text-customLightBlue">
        <Info size={24} className="flex-shrink-0" />
        <h2 className="text-sm font-medium md:text-base">
          Choose the best way to complete each statement from the drop-down menu
          (▼).
        </h2>
      </div>

      <ol className="space-y-4">
        {questions.map((question, index) => {
          const textParts = question.text.split("<<>>");
          return (
            <li
              key={index}
              className="flex items-center gap-2 text-xs text-gray-600 md:text-sm"
            >
              <span className="">{index + 1}.</span>
              {textParts.map((part, i) => (
                <React.Fragment key={i}>
                  <span className="">{part}</span>
                  {i < textParts.length - 1 && (
                    <Select
                      onValueChange={(value) =>
                        handleChange(value, question.text, question.choices!)
                      }
                    >
                      <SelectTrigger className="text-xs font-semibold bg-white border-none rounded-none md:text-xl min-w-20 w-fit focus:outline-none focus:ring-0">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.choices &&
                          question.choices.map((option, index) => (
                            <SelectItem key={index} value={option.text!} className="text-xs md:text-base">
                              {option.text}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </React.Fragment>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default QuestionnaireComponent;

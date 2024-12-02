import { DropdownSelect } from "@/pages/reading/components/dropdown-select";
import { Question } from "@/types/reading";
import React from "react";

interface QuestionSetProps {
  questions: Question[];
  questionInfo: string;
  startNumber: number; 
}

export const QuestionSet: React.FC<QuestionSetProps> = ({
  questions,
  questionInfo,
  startNumber,
}) => {
  if (questions.length === 0) {
    return null;
  }
  return (
    <div>
      <h2 className="mt-2 mb-4 text-sm font-medium text-customLightBlue md:text-base">
        <span className="inline-block mr-2 text-center text-white rounded-full size-4 md:size-6 bg-customLightBlue">
          i
        </span>
        {questionInfo}
      </h2>
      <div className="p-4 space-y-2 border border-black rounded-md">
        {questions.map((question, index) => {
          const textParts = question.text.split("<<>>");
          const questionNumber = startNumber + index; 

          return (
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 text-xs text-gray-600 md:text-sm"
            >
              <span className="">{questionNumber}.</span>
              {textParts.map((part, i) => (
                <React.Fragment key={i}>
                  <span>{part}</span>
                  {i < textParts.length - 1 && (
                    <DropdownSelect question={question} />
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

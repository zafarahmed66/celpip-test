import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

interface MCQQuestionProps {
  options: {
    text: string;
}[];
  questionInfo: string;
}

function numberToLetter(num: number) {
  return String.fromCharCode(65 + num);
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  options,
  questionInfo,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionChange = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <ScrollArea className="col-span-2 p-4 bg-customSkyBlue border-l border-gray-300 h-[75vh]">
      <h2 className="mb-4 font-medium text-customLightBlue">
        <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">i</span>
        {questionInfo}
      </h2>
      <div className="pl-8 list-disc">
        {options.map((option, index) => (
          <label key={index} className="block mb-2 text-sm text-gray-600">
            <input
              type="radio"
              name="option"
              value={index}
              onChange={() => handleOptionChange(index)}
              className="mr-2"
            />
            <span className="font-medium">Option {numberToLetter(index)}:</span> {option.text}
          </label>
        ))}
      </div>

      {selectedOption !== null && (
        <div className="">
          <Separator className="my-8" />
          <h2 className="font-medium text-customLightBlue">
          <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">i</span>
          {"Explain the reasons for your choice. Write about 150-200 words."}
        </h2>
        <textarea
          name=""
          id=""
          className="w-full p-2 mt-8 border rounded-md h-80"
          ></textarea>
          </div>
      )}
    </ScrollArea>
  );
};
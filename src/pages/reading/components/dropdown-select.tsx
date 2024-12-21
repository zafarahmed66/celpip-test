import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReadingContext } from "@/context/ReadingContext";
import { cn, getFlattenedQuestionIndexReading } from "@/lib/utils";
import { Choice, Question } from "@/types/reading";

interface DropdownSelectProps {
  question: Question;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({ question }) => {
  const { setUserAnswer, readingData } = useReadingContext();
  if (!readingData) return <div>Loading....</div>;
  const handleChange = (
    value: string,
    questionText: string,
    options: Choice[]
  ) => {
    const questionIndex = getFlattenedQuestionIndexReading(
      readingData,
      questionText
    );

    const selectedIndex = options.findIndex((option) => option.text === value);
    if (questionIndex != -1) {
      setUserAnswer(questionIndex!, selectedIndex);
    } else {
      setUserAnswer(-1, selectedIndex);

    }
  };
  return (
    <Select
      onValueChange={(value) =>
        handleChange(value, question.text, question.choices)
      }
    >
      <SelectTrigger
        className={cn(
          "min-w-20 h-6 md:max-w-[400px] w-fit max-w-[250px]  rounded-none border-none bg-white font-semibold focus:outline-none focus:ring-0 text-xs md:text-xl "
        )}
      >
        <SelectValue placeholder=""  />
      </SelectTrigger>
      <SelectContent className="w-[300px] md:w-full ">
        {question.choices.map((option, index) => (
          <SelectItem
            className="text-xs md:text-sm "
            key={index}
            value={option.text}
          >
            {option.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

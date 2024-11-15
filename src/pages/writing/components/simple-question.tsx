import { ScrollArea } from "@/components/ui/scroll-area";

interface SimpleQuesionProps {
  instructions: {
    text: string;
  }[];
  questionInfo: string;
}

export default function SimpleQuesion({
    instructions,
    questionInfo
}: SimpleQuesionProps) {
  return (
    <ScrollArea className="col-span-2 p-4 bg-customSkyBlue border-l border-gray-300 h-[75vh]">
      <h2 className="mb-4 font-medium text-customLightBlue">
        <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">
          i
        </span>
        {questionInfo}
      </h2>
      <ul className="pl-8 list-disc">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-sm">
            {instruction.text}
          </li>
        ))}
      </ul>

      <textarea
        name=""
        id=""
        className="w-full p-2 mt-8 border rounded-md h-80"
      ></textarea>
    </ScrollArea>
  );
}

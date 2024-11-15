import { ScrollArea } from "@/components/ui/scroll-area";

interface ReadingPassageProps {
  content: string;
  passageInfo?: string;
}

export const ReadingPassage: React.FC<ReadingPassageProps> = ({
  content,
  passageInfo,
}) => {
  return (
    <ScrollArea className="bg-customLighGray p-4 h-[75vh]">
      {passageInfo && (
        <h2 className="mb-4 font-medium text-customLightBlue">
          <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">
            i
          </span>
          {passageInfo}
        </h2>
      )}
      {content.startsWith("http") ?
     <img src={content} />
     : <div className="text-sm text-gray-600 whitespace-pre-wrap">{content}</div>}
    </ScrollArea>
  );
};

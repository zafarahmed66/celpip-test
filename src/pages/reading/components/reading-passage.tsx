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
    <ScrollArea className="bg-customLighGray p-4 min-h-[75vh]">
      {passageInfo && (
        <h2 className="mb-4 text-sm font-medium text-customLightBlue md:text-base">
          <span className="inline-block mr-2 text-xs text-center text-white rounded-full size-4 md:text-base md:size-6 bg-customLightBlue">
            i
          </span>
          {passageInfo}
        </h2>
      )}
      {content.startsWith("http") ?
     <img src={content} />
     : <div className="text-xs text-gray-600 whitespace-pre-wrap md:text-sm">{content}</div>}
    </ScrollArea>
  );
};

import { Separator } from "@/components/ui/separator";
import Timer from "./timer";
import { Instruction } from "@/types/speaking";

interface SpeakingTestProps {
  title: string;
  preparationTime: number;
  recordingTime: number;
  additionalInfo?: Instruction[];
}

export default function SpeakingTest({
  title,
  preparationTime,
  recordingTime,
  additionalInfo
}: SpeakingTestProps) {
   
  return (
    <div>
      <h2 className="mb-4 text-sm font-medium text-customLightBlue md:text-base">
        <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">
          i
        </span>
        {title}
      </h2>
      {
        additionalInfo?.map((info, index) => (
          <div key={index} className="text-sm md:text-base">{ info.text}</div>
      ))

      }
      <Separator className="my-8" />
      <Timer preparationTime={preparationTime} recordingTime={recordingTime} />
    </div>
  );
}

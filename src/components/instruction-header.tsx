interface InstructionHeaderProps {
    text: string;
}

export default function InstructionHeader({
    text
} : InstructionHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 font-medium md:px-8 text-customLightBlue">
      <span className="flex-shrink-0 inline-block mr-2 text-xs text-center text-white rounded-full size-4 md:size-6 md:text-base bg-customLightBlue">
        i
      </span>
      <h3 className="text-sm md:text-base">{text}</h3>
    </div>
  );
}

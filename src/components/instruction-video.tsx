import InstructionHeader from "./instruction-header";

interface InstructionVideoProps {
  videoSrc: string;
  description?: string;
}

const InstructionVideo = ({
  description,
  videoSrc
}: InstructionVideoProps) => {
  return (
   
      <div className="min-h-[75vh] px-4 pt-4  bg-customLighGray">
        {description && <InstructionHeader
        text={description}
        />}
        <video
          controls
          src={videoSrc}
          className="w-full h-[200px] md:h-[50vh] mt-10"
          playsInline
      />
      </div>
  );
};
export default InstructionVideo;

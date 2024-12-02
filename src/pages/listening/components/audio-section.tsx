import { Info, Volume2 } from "lucide-react";
import { useState, useRef, SetStateAction, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "react-router-dom";

interface AudioSectionProps {
  setEnableNext?: React.Dispatch<SetStateAction<boolean>>;
  audioUrl: string;
  audioInfo: string;
}

const AudioSection = ({
  setEnableNext,
  audioInfo,
  audioUrl,
}: AudioSectionProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [location.pathname]);

  const handlePlay = () => {
    setIsCompleted(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      const progressValue = (currentTime / duration) * 100;
      setProgress(progressValue);
    }
  };

  const handleEnd = () => {
    setIsCompleted(true);
    if (setEnableNext) {
      setEnableNext(true);
    }
  };

  return (
    <div className="flex-1 px-6 py-4 overflow-x-hidden bg-customLighGray">
      <div className="flex items-start gap-2 mb-4 tracking-tight text-customLightBlue">
        <Info className="self-start flex-shrink-0" />
        <h3 className="text-sm leading-tight md:text-base">
          {audioInfo ||
            "Listen to a short statement. You will hear it only once."}
        </h3>
      </div>

        <div className="flex items-center justify-between gap-8 px-10 py-8 mx-auto rounded-md md:flex-col md:flex-row bg-customGray w-fit">
          <div className="p-2 bg-white rounded-sm">
            {!isCompleted ? <Volume2 /> : <Info />}
          </div>
          <div className="flex flex-col items-center justify-center text-sm md:text-base">
            <span>
              {!isCompleted ? "Playing..." : `Click "NEXT" to continue.`}
            </span>
            {!isCompleted && (
              <Progress
                value={progress}
                className="w-[100px] md:w-[200px] bg-white rounded-none h-4 mt-2"
              />
            )}
          </div>
        </div>

      <audio
        ref={audioRef}
        controls
        autoPlay
        src={audioUrl}
        className="mx-auto mb-4 "
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnd}
      />
    </div>
  );
};

export default AudioSection;

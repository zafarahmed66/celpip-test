import { Clock, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "react-router-dom";
import { useSpeakingContext } from "@/context/SpeakingContext";
import { Button } from "@/components/ui/button";

interface TimerProps {
  preparationTime: number;
  recordingTime: number;
}

const Timer = ({ preparationTime, recordingTime }: TimerProps) => {
  const [time, setTime] = useState(preparationTime);
  const [isRecording, setIsRecording] = useState(false);
  const [show, setShow] = useState(false);
  const [pause, setPause] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(recordingTime);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { endAudio, startAudio } = useSpeakingContext();

  const startRef = useRef<HTMLAudioElement>(null);
  const endRef = useRef<HTMLAudioElement>(null);
  const location = useLocation();

  useEffect(() => {
    setTime(preparationTime);
    setRecordingDuration(recordingTime);
    setIsRecording(false);
    setShow(false);
    setAudioUrl(null);
  }, [location.pathname, preparationTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isRecording) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setPause(true);
            clearInterval(interval!);
            startRef.current?.play();
            setTimeout(() => {
              setPause(false);
              setShow(true);
              setIsRecording(true);
              startRecording();
            }, 3000);
            return recordingDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording, recordingDuration, preparationTime]);

  useEffect(() => {
    if (time === 0 && isRecording) {
      stopRecording();
      endRef.current?.play();
      setShow(false);
    }
  }, [time, isRecording]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="py-2">
      {!isRecording && (
        <div className="flex items-center justify-between gap-8 px-10 py-6 mx-auto bg-gray-200 rounded-md w-fit">
          <div className="p-2 bg-white rounded-sm">
            <Clock />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-semibold">
              {!pause ? `Preparation Time` : `Recording starting...`}
            </span>
            <span className="text-blue-600">{!pause && `${time}`}</span>
          </div>
        </div>
      )}

      {show && isRecording && (
        <div className="flex items-center justify-between gap-8 px-10 py-6 mx-auto bg-gray-200 rounded-md w-fit">
          <div className="p-2 bg-white rounded-sm">
            <Mic />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-semibold">Recording Time</span>
            <span className="text-red-600">{time}</span>
            <Progress
              value={((recordingDuration - time) / recordingDuration) * 100}
            />
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <audio controls src={audioUrl} ref={audioRef}></audio>
          <Button
            onClick={() => {
              setAudioUrl(null);
              setTime(3);
              setIsRecording(false);
              setShow(false);
            }}
          >
            Re-record
          </Button>
        </div>
      )}

      <audio ref={startRef} src={startAudio} />
      <audio ref={endRef} src={endAudio} />
    </div>
  );
};

export default Timer;

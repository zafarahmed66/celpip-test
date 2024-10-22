import CardLayout from "@/components/card-layout";
import { useListeningContext } from "@/context/ListeningContext";
import { useReadingContext } from "@/context/ReadingContext";
import { useSpeakingContext } from "@/context/SpeakingContext";
import { useTestContext } from "@/context/TestContext";
import { useWritingContext } from "@/context/WritingContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface VideoInstructionProps {
  title: string;
  prevLink: string;
  videoSrc: string;
}

const VideoInstruction = ({
  title,
  prevLink,
  videoSrc,
}: VideoInstructionProps) => {
  const { currentTest, attemptId, tests, setCurrentTest } = useTestContext();
  const { fetchWritingData } = useWritingContext();
  const { fetchReadingData } = useReadingContext();
  const { fetchListeningData } = useListeningContext();
  const { fetchSpeakingData } = useSpeakingContext();

  const [nextLink, setNextLink] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (currentTest && currentTest.modules && currentTest.modules.length > 0) {
      const moduleType = currentTest?.modules[0]?.type;

      switch (moduleType) {
        case "Writing":
          console.log("fetching writing");
          fetchWritingData();
          break;
        case "Reading":
          console.log("fetching reading");
          fetchReadingData();
          break;
        case "Speaking":
          console.log("fetching speaking");
          fetchSpeakingData();
          break;
        case "Listening":
          console.log("fetching listening");
          fetchListeningData();
          break;
        default:
          console.log("No valid module type");
      }
    }
  }, [currentTest]);

  useEffect(() => {
    if (testId && tests) {
      const foundTest = tests.find((test) => test._id === testId) || tests[0];
      if (foundTest) {
        setCurrentTest(foundTest); 
      }
    }
  }, [testId, tests]);

  useEffect(() => {
    if (currentTest && attemptId) {
      setNextLink(
        `/${currentTest.modules[0].type.toLowerCase()}/1?testId=${currentTest._id}&attemptId=${attemptId}`
      );
    }
  }, [currentTest, attemptId]);

  return (
    <CardLayout title={title} nextLink={nextLink} prevLink={prevLink}>
      <div className="py-8 px-16  min-h-[75vh] bg-gray-50">
        <video controls src={videoSrc} className="w-full h-[50vh]" autoPlay />
      </div>
    </CardLayout>
  );
};
export default VideoInstruction;

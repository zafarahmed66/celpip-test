import CardLayout from "@/components/card-layout";
import { useTestContext } from "@/context/TestContext";
import { useEffect, useState } from "react";

interface VideoInstructionProps {
  title: string;
  prevLink: string;
  videoSrc: string;
}

const VideoInstruction = ({
  title,
  prevLink,
  videoSrc
}: VideoInstructionProps) => {
  const { currentTest } = useTestContext();
  const [nextLink, setNextLink] = useState("/");


  useEffect(() => {
    if (currentTest) {
      setNextLink(`/${currentTest.modules[0].type.toLowerCase()}/1`)
    }
  }, [currentTest])

  return (
    <CardLayout
      title={title}
      nextLink={nextLink}
      prevLink={prevLink}
    >
      <div className="py-8 px-16  min-h-[75vh] bg-gray-50">
        <video
          controls
          src={videoSrc}
          className="w-full h-[50vh]"
          autoPlay
        />
      </div>
    </CardLayout>
  );
};
export default VideoInstruction;

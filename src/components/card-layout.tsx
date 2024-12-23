import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTestContext } from "@/context/TestContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Module } from "@/types/test";

interface CardLayout {
  title: string;
  nextLink?: string;
  prevLink?: string;
  isPrevDisabled?: boolean;
  children: ReactNode;
  timer?: number;
  enableNext?: boolean;
  recordingTime?: number;
  hasAnswerKey?: boolean;
  isSpeakingTest?: boolean;
}

export default function CardLayout({
  title,
  nextLink,
  prevLink,
  isPrevDisabled = false,
  children,
  enableNext = true,
  timer,
  recordingTime,
  hasAnswerKey = false,
  isSpeakingTest = false,
}: CardLayout) {
  const { currentTest } = useTestContext();
  const location = useLocation();
  const isLastPage = location.pathname.includes("speaking/end-page");

  const showTime = location.pathname.includes("speaking")
    ? "Prepartion: "
    : "Remaining time: ";

  const answerKey = location.pathname.includes("listening")
    ? "/listening/answer-key"
    : "/reading/answer-key";

  const displayTimer = (time: number) => {
    if (time) {
      if (time > 60) {
        return `${Math.ceil(time / 60)} minute${Math.ceil(time / 60) > 1 ? "s" : ""}`;
      } else if (time > 0) {
        return `${timer} second${time > 1 ? "s" : ""}`;
      }
    } else {
      return "None";
    }
  };



  return (
    <section className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <Card className="max-w-5xl mx-auto overflow-hidden bg-white border border-gray-300 shadow">
        <CardHeader
          className={cn(
            "bg-gray-200 py-2 border-gray-300 border-b space-y-4"
          )}
        >
          <div className="flex justify-between gap-2 pt-1">
            {currentTest?.modules.map((module) => (
              <ConfirmationModal {...module} />
            ))}
          </div>
          <div className="flex flex-row items-center justify-between">
            <h2
              className={cn(
                "text-gray-600 text-xs md:text-sm md:pb-0 pb-10",
              )}
            >
              {title}
            </h2>
            <div className="relative gap-4 text-xs md:text-sm">
              {recordingTime !== undefined && (
                <p className="absolute right-28 md:right-80 top-5 md:top-2 w-[180px]">
                  Recording:{" "}
                  <span
                    className={cn(
                      "text-red-600",
                      recordingTime >= 60 && "text-gray-700 font-medium"
                    )}
                  >
                    {isSpeakingTest
                      ? `${recordingTime} seconds`
                      : displayTimer(recordingTime)}
                  </span>
                </p>
              )}
              {timer !== undefined && (
                <p
                  className={cn(
                    "absolute right-[103px] md:right-32 top-10 md:top-2 w-[190px]",
                    location.pathname.includes("speaking") && "w-[190px]"
                  )}
                >
                  {showTime}
                  <span
                    className={cn(
                      "text-red-600",
                      timer >= 60 && "text-gray-700 font-medium"
                    )}
                  >
                    {isSpeakingTest ? `${timer} seconds` : displayTimer(timer)}
                  </span>
                </p>
              )}
              <div className="flex gap-2">
                <Button 
                  variant={"outline"}
                  disabled={isPrevDisabled}
                  onClick={() => prevLink && window.history.back()}
                >
                  <ChevronLeft className="size-6" />
                </Button>

                {!isLastPage && enableNext && (
                  <Link to={nextLink!}>
                    <Button variant={"outline"}>
                      <ChevronRight className="size-6" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 text-base min-h-[75vh] tracking-wide">
          {children}
        </CardContent>
        {hasAnswerKey && (
          <CardFooter
            className={cn(
              "flex py-2 bg-customGray border-gray-300 border-t",
              hasAnswerKey ? "justify-between" : "justify-end"
            )}
          >
            <Link to={answerKey}>
              <Button className="text-xs text-gray-600 bg-white md:text-base hover:bg-customLighGray hover:text-gray-600">
                Answer Key
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}




function ConfirmationModal(module : Module) {
  const naviate = useNavigate();
  const { currentTest, attemptId } = useTestContext();
  const location = useLocation();
  


    const handleModuleChange = (module: string) => {
      naviate(`/${module}/1?testId=${currentTest?._id}&attemptId=${attemptId}`);
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          // disabled={location.pathname.includes(module.type.toLowerCase())}
          className={`text-xs md:text-base  px-2 md:px-12 ${location.pathname.includes(module.type.toLowerCase()) && 'pointer-events-none'}`}
          variant={
            location.pathname.includes(module.type.toLowerCase())
              ? "default"
              : "outline"
          }
          id={module._id}
        >
          {module.type}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] md:max-w-md">
        <DialogHeader>
          <DialogDescription>
            Are you sure you want to abandon current test and initiate{" "}
            <strong>{module.type}</strong> of{" "}
            <strong> {currentTest?.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mx-auto sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={() => handleModuleChange(module.type.toLowerCase())}>
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

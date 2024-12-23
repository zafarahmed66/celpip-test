import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flattenReadingTest, getNextModule } from "@/lib/utils";
import CardLayout from "@/components/card-layout";
import {  Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useReadingContext } from "@/context/ReadingContext";
import { useTestContext } from "@/context/TestContext";
import { useEffect } from "react";
import { toast } from "sonner";

const ReadingResult = () => {
  const { userAnswers, readingData, fetchReadingData } = useReadingContext();
  const location = useLocation();
  const { tests, attemptId, setAttemptId, currentTest, setCurrentTest } =
    useTestContext();
  const [searchParams] = useSearchParams();
  const attemptIdParams = searchParams.get("attemptId");
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (!attemptId && attemptIdParams) {
      setAttemptId(attemptIdParams);
    }

    if (testId && tests) {
      const currentTest = tests.find((test) => test._id === testId) || tests[0];
      if (currentTest) {
        setCurrentTest(currentTest);
      }
    }
  }, [attemptIdParams, testId, tests, attemptId]);

  useEffect(() => {
    if (attemptId && currentTest) {
      fetchReadingData();
    }
  }, [attemptId, currentTest]);

  if (!readingData) return <div>Loading...</div>;
  const questions = flattenReadingTest(readingData);
  const totalQuestions = questions.length;
  const totalScore = () => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (
        answer >= 0 &&
        questions[index].question.choices &&
        questions[index].question.choices[answer].text ===
          questions[index].question.correctAnswer
      ) {
        score += 1;
      }
    });
    return score;
  };

  const nextModule = getNextModule("reading", currentTest!);
    if (nextModule === "/") {
      toast.success("All test are completed!");
      return <Navigate to="/" />;
    }
  

  return (
    <CardLayout
      title={`Practice Test A - Your Reading HZad Education Score`}
      nextLink={`/${nextModule}/1?testId=${testId}&attemptId=${attemptId}`}
      prevLink={location.pathname}
    >
      <div className="px-8 py-2 space-y-16">
        <Card className="border border-b-0 border-gray-300 rounded-none">
          <h1 className="text-center py-2 bg-[#CECBC7] font-medium text-xs md:text-sm p-2">
            HZad Education-GENERAL READING TEST
          </h1>
          <Table className="p-2 text-xs md:text-sm">
            <TableHeader>
              <TableHead className="text-center text-black">
                Number of Questions
              </TableHead>
              <TableHead className="text-center text-black">
                Your Score
              </TableHead>
              <TableHead className="text-center text-black">
                Your Approximate HZad Education Score
              </TableHead>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-center text-black">
                  {totalQuestions}
                </TableCell>
                <TableCell className="font-medium text-center text-black">
                  {totalScore()}
                </TableCell>
                <TableCell className="font-medium text-center text-black">
                  M
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <Card className="text-xs border-2 border-gray-300 rounded-none bg-customLighGray md:text-sm">
          <CardHeader className="py-4 font-semibold text-center">
            A Note About Your HZad Education Score
          </CardHeader>
          <CardContent>
            <p className="tracking-tight">
              The score provided here is an estimate based on the{" "}
              <span className="cursor-pointer text-customBlue hover:underline">
                Reading Test Score Conversion Chart.
              </span>{" "}
              Each HZad Education test item is field tested and reviewed by an
              expert panel before it is integrated into the official test. Since
              questions may have different levels of difficulty and may
              therefore be equated differently, the raw score required for a
              certain level may vary slightly from one test to another.
            </p>
          </CardContent>
        </Card>
      </div>
    </CardLayout>
  );
};

export default ReadingResult;

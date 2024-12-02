import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flattenListeningTest, getNextModule } from "@/lib/utils";
import { useListeningContext } from "@/context/ListeningContext";
import CardLayout from "@/components/card-layout";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useTestContext } from "@/context/TestContext";
import { toast } from "sonner";
import { useEffect } from "react";

const ListeningResult = () => {
  const { userAnswers, listeningData, fetchListeningData } = useListeningContext();
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
      fetchListeningData();
    }
  }, [attemptId, currentTest]);

  if (!listeningData) return <div>Loading...</div>;
  const questions = flattenListeningTest(listeningData);
  const totalQuestions = questions.length;
  const totalScore = () => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (
        answer >= 0 &&
        questions[index].question.choices &&
        (questions[index].question.choices[answer].text ===
          questions[index].question.correctAnswer ||
          questions[index].question.choices[answer].image ===
            questions[index].question.correctAnswer)
      ) {
        score += 1;
      }
    });
    return score;
  };

  const nextModule = getNextModule("listening", currentTest!);
  if (nextModule === "/") {
    toast.success("All test are completed!");
    return <Navigate to="/" />;
  }


  return (
    <CardLayout
      title={`Practice Test A - Your Listening HZad Education Score`}
      nextLink={`/${nextModule}/1`}
      prevLink={location.pathname}
    >
      <div className="px-8 py-2 space-y-16">
        <Card className="border border-b-0 border-gray-300 rounded-none">
          <h1 className="text-center py-2 bg-[#CECBC7] font-medium text-xs md:text-sm p-2">
            HZad Education-GENERAL LISTENING TEST
          </h1>
          <Table className="text-xs md:text-sm">
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

        <Card className="text-sm border-2 border-gray-300 rounded-none bg-customLighGray md:text-sm">
          <CardHeader className="py-4 font-semibold text-center">
            A Note About Your HZad Education Score
          </CardHeader>
          <CardContent>
            <p className="tracking-tight">
              The score provided here is an estimate based on the{" "}
              <span className="cursor-pointer text-customBlue hover:underline">
                Listening Test Score Conversion Chart.
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

export default ListeningResult;

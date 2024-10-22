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
import { Navigate, useLocation } from "react-router-dom";
import { useReadingContext } from "@/context/ReadingContext";
import { useTestContext } from "@/context/TestContext";
import { toast } from "sonner";

const ReadingResult = () => {
  const { userAnswers, readingData } = useReadingContext();
  const { currentTest } = useTestContext();
  const location = useLocation();

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
  console.log(nextModule)
   if (nextModule === "/") {
     toast.success("All test are completed!");
     return <Navigate to="/" />;
   }



  return (
    <CardLayout
      title={`Practice Test A - Your Reading HZad Education Score`}
      nextLink={`/${nextModule}/1`}
      prevLink={location.pathname}
    >
      <div className="px-8 py-2 space-y-16">
        <Card className="border border-b-0 border-gray-300 rounded-none">
          <h1 className="text-center py-2 bg-[#CECBC7] font-medium">
            HZad Education-GENERAL READING TEST
          </h1>
          <Table>
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

        <Card className="border-2 border-gray-300 rounded-none bg-customLighGray">
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

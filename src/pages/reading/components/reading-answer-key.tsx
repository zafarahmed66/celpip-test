import CardLayout from "@/components/card-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, X } from "lucide-react";
import { flattenReadingTest, getActualQuestionIndexReading } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import { useReadingContext } from "@/context/ReadingContext";
import { useTestContext } from "@/context/TestContext";
import { useEffect } from "react";

export default function ReadingAnswerKeyPage() {
  const { readingData, userAnswers, fetchReadingData } = useReadingContext();
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
  const data = flattenReadingTest(readingData);
  let currentIndex = 1;
  return (
    <CardLayout
      title={`${currentTest?.title} - Reading Answer Key`}
      nextLink={`/reading/result?testId=${testId}&attemptId=${attemptId}`}
    >
      <div className="p-4">
        <Alert className="flex gap-2 mb-4 border rounded-sm bg-customGray border-customBlue">
          <Badge className="rounded-full bg-customBlue hover:bg-customBlue h-fit">
            NOTE
          </Badge>
          <AlertDescription className="text-gray-600">
            Use the back arrow in your browser to return to the page you just
            came from. The back arrow is located at the top left of your screen,
            next to the address bar.
          </AlertDescription>
        </Alert>

        <Table className="text-sm text-gray-600">
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Answer Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const answerIndex = userAnswers[index];
              const userAnswer = item.question.choices?.[answerIndex];

              const correctAnswer = item.question.correctAnswer;
              let isCorrect = false;
              if (userAnswer) {
                isCorrect = userAnswer?.text === correctAnswer;
              }

              const prevItem = data[index - 1];
              if (prevItem && item.title !== prevItem.title) {
                currentIndex = 1;
              }

              return (
                <>
                  {prevItem && item.title !== prevItem.title && (
                    <div className="pl-2 my-2 text-sm">
                      <Link
                        to={`/reading/${getActualQuestionIndexReading(readingData, prevItem.title)?.toString()}`}
                        className="text-customBlue hover:underline"
                      >
                        Return to {prevItem.title}
                      </Link>
                    </div>
                  )}
                  <TableRow key={`demo-${index}`}>
                    <TableCell>{`${item.title}- Q${currentIndex++}`}</TableCell>
                    <TableCell>{item.question.correctAnswer}</TableCell>
                    <TableCell className="">
                      <div className="flex justify-between">
                        <>
                          {answerIndex >= 0 &&
                            item.question.choices &&
                            item.question.choices?.[answerIndex]?.text}
                          {isCorrect ? (
                            <CheckIcon
                              size={20}
                              className="inline-block ml-2 text-green-500"
                            />
                          ) : (
                            <>
                              {answerIndex >= 0 && (
                                <X
                                  size={20}
                                  className="inline-block ml-2 text-red-500"
                                />
                              )}
                            </>
                          )}
                        </>
                      </div>
                    </TableCell>
                  </TableRow>
                  {index === data.length - 1 && (
                    <div className="pl-2 my-2 text-sm">
                      <Link
                        to={`/reading/${getActualQuestionIndexReading(readingData, prevItem.title)?.toString()}`}
                        className="text-customBlue hover:underline"
                      >
                        Return to {prevItem.title}
                      </Link>
                    </div>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </CardLayout>
  );
}

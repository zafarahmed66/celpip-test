import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTestContext } from "@/context/TestContext";
import { Test } from "@/types/test";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo-vertical.png";

export default function Dashboard() {
  const { currentTest, tests, setAttemptId, setAttemptTestData } =
    useTestContext();

  useEffect(() => {
    setAttemptId(null);
    setAttemptTestData(null);
  }, [currentTest]);
  return (
    <section>
      <div className="flex flex-col items-center max-w-5xl gap-8 p-4 mx-auto my-8 bg-white shadow-sm md:p-8">
        <div>
          <img src={logo} alt="Logo" className="object-cover" />
        </div>
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-medium">
            {currentTest
              ? currentTest.title
              : "Welcome to Your Hzad Education Online Study Materials!"}
          </h2>
          <p className="text-sm">
            This practice test package contains two complete HZad
            Education-General Tests. The package also includes answer keys for
            the Listening and Reading Tests and Performance Standards showing
            the key factors that HZad Education raters consider when they assess
            Writing and Speaking responses.
          </p>
          <p className="text-sm text-red-500">
            Note: Unauthorized distribution or sharing of these files is
            prohibited as per Copyright and punishable by law.
          </p>
        </div>
        {currentTest ? (
          <div className="flex gap-2">
            <Link to={"/test"}>
              <Button>Start</Button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <DropDownSelect
              variant="default"
              label="Start Test"
              tests={tests!}
            />
          </div>
        )}
        <div className="space-y-4 text-sm text-center text-customBlue">
          <p> Test Format</p>
          <p>
            {" "}
            Performance Standards for the HZad Education-General Writing Test
          </p>
          <p>
            {" "}
            Performance Standards for the HZad Education-General Speaking Test
          </p>
          <p>Practice Test A - Listening Transcripts </p>
          <p> Practice Test B - Listening Transcripts Study</p>
          <p> Materials Bookstore Score Comparison Chart</p>
        </div>
      </div>
    </section>
  );
}

function DropDownSelect({
  tests,
  label,
  variant,
}: {
  label: string;
  tests: Test[];
  variant: "outline" | "default";
}) {
  const { setCurrentTest } = useTestContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {tests?.map((test) => (
          <DropdownMenuItem key={test._id} onClick={() => setCurrentTest(test)}>
            {test.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DropDown from "./components/dropdown";
import { useTestContext } from "@/context/TestContext";
import { Navigate } from "react-router-dom";

export default function Test() {
  const { currentTest } = useTestContext();
  if (!currentTest) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto overflow-hidden bg-white border border-gray-300 rounded-none shadow">
        <CardHeader className="px-4 py-2 font-normal text-gray-600 bg-gray-200 border-b border-gray-300">
          {currentTest?.title}
        </CardHeader>
        <CardContent className="min-h-[80vh]">
          <div className="p-2 py-4 space-y-4 text-sm text-gray-600 md:p-6">
            <div className="whitespace-pre-wrap">{currentTest.description}</div>
            <Separator />
            <div className="flex justify-center">
              <DropDown />
            </div>

            <Separator />

            <div
              className="relative px-4 py-3 text-sm text-gray-600 border rounded bg-customGray border-customBlue"
              role="alert"
            >
              <span className="p-1 px-2 text-white bg-customBlue rounded-2xl">
                NOTE
              </span>
              <span className="block text-xs md:text-sm sm:inline">
                {" "}
                In response to ongoing research and development, changes may
                occasionally be made to the HZad Education Test. Check the HZad
                Education website for any updates to the HZad Education Test:{" "}
                <a
                  href="https://www.hzadeducation.com"
                  target="_blank"
                  className="text-customBlue"
                >
                  {" "}
                  https://www.hzadeducation.com
                </a>
                .
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="h-8 border-t border-gray-300 bg-customGray"></CardFooter>
      </Card>
    </section>
  );
}

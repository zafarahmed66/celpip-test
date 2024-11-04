import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTestContext } from "@/context/TestContext"
import { Link } from "react-router-dom"

const DropDown = () => {
  const { currentTest, attemptId } = useTestContext();
  // if (!attemptId) return;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"lg"}
          className="px-20 py-2 text-lg text-white bg-customBlue hover:bg-customBlue/90"
        >
          START
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-white rounded-none bg-customBlue">
        <DropdownMenuItem className="w-56 focus:bg-customDarkBlue focus:text-white">
          <Link
            to={`/complete-test?testId=${currentTest?._id}`}
            className="w-full text-center"
          >
            {"COMPLETE TEST"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {currentTest?.modules.map((route, index) => (
          <>
            <DropdownMenuItem
              key={index}
              className="w-56 focus:bg-customDarkBlue focus:text-white"
            >
              <Link
                to={`/${route.type.toLowerCase()}/1?testId=${currentTest._id}&attemptId=${attemptId}`}
                className="w-full text-center"
              >
                {" "}
                {route.type.toUpperCase()}{" "}
              </Link>
            </DropdownMenuItem>
            {index != currentTest.modules.length - 1 && (
              <DropdownMenuSeparator />
            )}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default DropDown
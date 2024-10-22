import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTestContext } from "@/context/TestContext"
import { Link } from "react-router-dom"

const DropDown = () => {
  const { currentTest } = useTestContext();
  
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
          <Link to={`/complete-test`} className="text-center">
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
                to={`/${route.type.toLowerCase()}/1`}
                className="text-center"
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
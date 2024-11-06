import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useTestContext } from "@/context/TestContext";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { tests, setCurrentTest, fetchTests } = useTestContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleChange = (id: string) => {
    const currentTest = tests?.find((test) => test?._id === id);
    if (currentTest) {
      setCurrentTest(currentTest);
      navigate("/")
    }
  };

  const handleLogout = () => {
    toast.success("Logout successful");
    navigate("/auth");
    logout();
  };

  const testItems = useMemo(
    () =>
      tests?.map((test) => (
        <SelectItem key={test._id} value={test._id}>
          {test.title}
        </SelectItem>
      )),

    [tests]
  );
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        <div className="flex items-center flex-1">
          <Link to={"/"} className="hidden md:block">
            <img
              src="/logo.png"
              alt="HZad Education Logo"
              className="object-cover mr-2 w-80"
            />
          </Link>
          <Link to={"/"} className="md:hidden">
            <img
              src="/no-text-logo.png"
              alt="HZad Education Logo"
              className="object-cover w-24 mr-2"
            />
          </Link>
        </div>
        {isAuthenticated && (
          <div className="flex items-center flex-1 gap-2 ">
            <p className="hidden md:block text-sm text-[#262161] font-semibold">
              Selected Product:{" "}
            </p>
            <Select onValueChange={handleChange}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Click to Select Product" />
              </SelectTrigger>
              <SelectContent className="">{testItems}</SelectContent>
            </Select>
          </div>
        )}
        <div className="flex justify-end flex-1">
          {isAuthenticated && <Button onClick={handleLogout}>Logout</Button>}
        </div>
      </div>
    </header>
  );
};
export default Navbar;

import { useNavigate } from "react-router-dom";
import { Clock, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface PreparationProps {
  time: number;
  next: string;
  info: string;
}

const Preparation = ({
  time,
  next,
  info
} : PreparationProps) => {
    const [timer, setTimer] = useState(time);
    const naviate = useNavigate();

    useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            naviate(next);
            return 0;
          };
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
    
  
  return (
        <div className="px-8 py-4">
        <div className="flex items-start gap-2 mb-4 tracking-tight text-customLightBlue">
        <Info className="self-start flex-shrink-0" />
        <h3 className="text-sm font-medium tracking-wide md:text-base">{info}</h3>
      </div>
         <div className="flex items-center justify-between gap-8 px-10 py-6 mx-auto bg-gray-200 rounded-md w-fit">
          <Clock />
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-semibold md:text-base">Preparation Time</span>
            <span className="text-sm text-blue-600 md:text-base">{timer}</span>
          </div>
        </div>
        </div>
  )
}
export default Preparation
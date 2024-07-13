import { useState } from "react";
import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";

export function StarRating() {
  const [score, setScore] = useState(0);

  const handleChooseValoration = (index) => {
    setScore(index + 1);
  };

  return (
    <div className="flex items-center gap-6 mt-3 sm:mt-0">
      {[...new Array(5)].map((_, index) => {
        return index >= score ? (
          <GoStar
            onClick={() => handleChooseValoration(index)}
            key={index}
            className="scale-[2.5] cursor-pointer select-none text-gray-400 hover:bg-slate-100 p-[2px] rounded-full"
          />
        ) : (
          <GoStarFill
            onClick={() => handleChooseValoration(index)}
            key={index}
            className="scale-[2.5] cursor-pointer select-none text-teal-700 hover:bg-slate-100 p-[2px] rounded-full"
          />
        );
      })}
    </div>
  );
}

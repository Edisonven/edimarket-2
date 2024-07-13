import { useState } from "react";
import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";

export function StarRating() {
  const [score, setScore] = useState(0);
  return (
    <div className="flex items-center gap-5 mt-3 sm:mt-0">
      {[...new Array(5)].map((_, index) => {
        return index >= score ? (
          <GoStar
            key={index}
            className="scale-[2] cursor-pointer select-none text-gray-400"
          />
        ) : (
          <GoStarFill
            key={index}
            className="scale-[2] cursor-pointer select-none text-teal-700"
          />
        );
      })}
    </div>
  );
}

import { useContext, useState } from "react";
import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";

export function StarRating({ order }) {
  const [score, setScore] = useState(0);
  const { setProductToRate } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleChooseValoration = (index) => {
    const newScore = index + 1;
    setScore(newScore);

    if (order) {
      setProductToRate({
        ...order,
        score: newScore,
      });
    }
    setTimeout(() => {
      navigate("/send-my-valoration");
    }, 500);
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

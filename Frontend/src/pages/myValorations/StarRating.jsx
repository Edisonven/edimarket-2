import { useContext, useState } from "react";
import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate, useLocation } from "react-router-dom";

export function StarRating({ order, className }) {
  const { setProductToRate, setScore, score } = useContext(ProductContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScore, setCurrentScore] = useState(0);

  const handleChooseValoration = (index) => {
    const newScore = index + 1;
    setCurrentScore(newScore);
    setScore(newScore);

    if (order) {
      setProductToRate({
        ...order,
        score: newScore,
      });
    }
    setTimeout(() => {
      if (location.pathname !== "/send-my-valoration") {
        navigate("/send-my-valoration");
      }
      return;
    }, 500);
  };

  return (
    <div className={`${className} flex items-center gap-6 mt-3 sm:mt-0`}>
      {[...new Array(5)].map((_, index) => {
        const displayScore =
          location.pathname !== "/send-my-valoration" ? currentScore : score;

        return index >= displayScore ? (
          <GoStar
            onClick={() => handleChooseValoration(index)}
            key={index}
            className="star-icon scale-[2.5] cursor-pointer select-none text-gray-400 hover:bg-slate-100 p-[2px] rounded-full"
          />
        ) : (
          <GoStarFill
            onClick={() => handleChooseValoration(index)}
            key={index}
            className="star-icon scale-[2.5] cursor-pointer select-none text-teal-700 hover:bg-slate-100 p-[2px] rounded-full"
          />
        );
      })}
    </div>
  );
}

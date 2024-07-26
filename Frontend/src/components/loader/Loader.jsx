import { Blocks } from "react-loader-spinner";
import Lottie from "react-lottie";
import animationData from "./loader-animation.json";

export function Loader({ className }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className={`${className} flex flex-col justify-center items-center my-36`}
    >
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
}

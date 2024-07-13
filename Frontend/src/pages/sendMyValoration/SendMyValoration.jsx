import { useContext, useEffect } from "react";
import "../sendMyValoration/sendMyValoration.css";
import { ProductContext } from "../../context/ProductContext";
import { StarRating } from "../myValorations/StarRating";

export function SendMyValoration() {
  const { productToRate, setProductToRate, score } = useContext(ProductContext);

  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem("product"));
    if (storedProduct) {
      setProductToRate(storedProduct);
    }
  }, [setProductToRate]);

  useEffect(() => {
    setProductToRate({
      ...productToRate,
      score: score,
    });
  }, [score]);

  useEffect(() => {
    if (productToRate) {
      localStorage.setItem(
        "product",
        JSON.stringify({ ...productToRate, score })
      );
    }
  }, [productToRate, score]);

  console.log(productToRate);
  return (
    <section className="sendmyvaloration__container">
      <div className="sendmyvaloration__body bg-white shadow-sm rounded-md p-3 h-[480px]">
        <h1 className="text-2xl font-semibold my-5 text-center">
          ¿Qué te pareción tu producto?
        </h1>
        <div className="flex flex-col items-center">
          <figure>
            <img
              className="w-full max-w-[150px]"
              src={productToRate?.imagen}
              alt=""
            />
          </figure>
          <h3 className="mb-3">{productToRate?.nombre}</h3>
          <StarRating />
        </div>
      </div>
    </section>
  );
}

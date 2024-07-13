import { useContext, useEffect } from "react";
import "../sendMyValoration/sendMyValoration.css";
import { ProductContext } from "../../context/ProductContext";
import { StarRating } from "../myValorations/StarRating";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";

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

  return (
    <section className="sendmyvaloration__container">
      <div className="sendmyvaloration__body bg-white shadow rounded-md p-3 min-h-[480px]">
        <h1 className="text-2xl font-semibold my-5 text-center">
          ¿Qué te pareción tu producto?
        </h1>
        <div className="flex flex-col items-center gap-5">
          <figure>
            <img
              className="w-full max-w-[150px]"
              src={productToRate?.imagen}
              alt=""
            />
          </figure>
          <h3 className="">{productToRate?.nombre}</h3>
          <StarRating />
        </div>
        <div className="border mt-10 w-full max-w-[430px] flex flex-col items-center rounded-md mx-auto shadow-sm  p-4 sm:p-6">
          <h3 className="my-4 font-medium">
            Cuéntanos qué tal te pareció tu producto
          </h3>
          <span className="mb-3 text-sm text-gray-500">(Opcional)</span>
          <form className="w-full h-full flex flex-col items-center">
            <textarea
              rows="4"
              className="border w-full h-full rounded-md resize-none focus:border-none outline-teal-500 p-3"
              name=""
              id=""
            />
            <GeneralBtn className="mt-5 h-[45px] flex items-center" type="secondary">
              Enviar
            </GeneralBtn>
          </form>
        </div>
      </div>
    </section>
  );
}

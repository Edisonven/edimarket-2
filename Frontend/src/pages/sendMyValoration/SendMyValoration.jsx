import { useContext, useEffect, useState } from "react";
import "../sendMyValoration/sendMyValoration.css";
import { ProductContext } from "../../context/ProductContext";
import { StarRating } from "../myValorations/StarRating";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { UserContext } from "../../context/UserContext";

export function SendMyValoration() {
  const { productToRate, setProductToRate, score } = useContext(ProductContext);
  const { userToken } = useContext(UserContext);
  const [valoration, setValoration] = useState("");

  const handleChange = (e) => {
    setValoration(e.target.value);
  };

  const handleSendValoration = async (e) => {
    e.preventDefault();

    if (userToken) {
      try {
        const response = await fetch(
          "http://localhost:3000/productos/valoracion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              idProducto: productToRate.producto_id,
              comentario: valoration,
              calificacion: productToRate.score,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al enviar valoración");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error.message || "Error al enviar valoración");
        throw error;
      }
    }
  };

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
            Cuéntanos cómo te fue con tu producto
          </h3>
          <span className="mb-3 text-sm text-gray-500">(Opcional)</span>
          <form
            onSubmit={handleSendValoration}
            className="w-full h-full flex flex-col items-center"
          >
            <textarea
              onChange={handleChange}
              value={valoration}
              rows="4"
              className="border w-full h-full rounded-md resize-none focus:border-none outline-teal-500 p-3"
              name="valoration"
              id=""
            />
            <GeneralBtn
              className="mt-5 h-[45px] flex items-center"
              type="secondary"
            >
              Enviar
            </GeneralBtn>
          </form>
        </div>
      </div>
    </section>
  );
}

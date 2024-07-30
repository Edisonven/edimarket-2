import emptyCart from "/imgs/aplication/empty-cart-2.png";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import { NavLink, useNavigate } from "react-router-dom";
import "../emptyCart/emptyCart.css";

export function EmptyCart() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };
  return (
    <div className="emptyCart__container flex justify-center items-center flex-col mb-50">
      <div className="emptyCart__body flex flex-col items-center h-[500px] justify-center gap-8">
        <div className="flex flex-col gap-3 items-center">
          <img
            src={emptyCart}
            alt="empty cart"
            className="w-[150px]"
          />
          <h1 className="text-center">¡Tu carro está vacío!</h1>
          <p className="pb-[50px]">
            Añade algunos productos para empezar a comprar
          </p>
        </div>

        <GeneralBtn onClick={handleBackToHome} type="primary">
          Volver a productos
        </GeneralBtn>
      </div>
    </div>
  );
}

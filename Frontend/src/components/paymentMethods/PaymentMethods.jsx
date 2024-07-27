import { useContext, useEffect } from "react";
import classNames from "classnames";
import shipping from "/src/pages/shipping/shipping.module.css";
import { UserContext } from "../../context/UserContext";
import { CheckoutContext } from "../../context/CheckoutContext";
import webPayMethod from "/imgs/aplication/webpay-logo.png";

export function PaymentMethods() {
  const { user, userCreditCards, userToken, setUserCreditCards } =
    useContext(UserContext);
  const { selectedPaymentMethod, handleCheckboxChange, handleEfectivoChange } =
    useContext(CheckoutContext);

  return (
    <>
      <div className={classNames("p-4", shipping.billing_box)}>
        <h2>Elige tu medio de pago</h2>
        <div className="mb-4">
          <figure>
            <img
              className="w-full max-w-[220px] sm:max-w-[250px]"
              src={webPayMethod}
              alt=""
            />
          </figure>
          <div className="flex items-center">
            <input
              type="checkbox"
              value="webpay"
              onChange={handleCheckboxChange}
              checked={selectedPaymentMethod === "webpay"}
              className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="" className="font-semibold">
              Tarjetas de crédito o débito
            </label>
          </div>
        </div>

        <div
          className={classNames(
            "efectivo",
            shipping.delivery_type_container,
            shipping.delivery
          )}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              id="checkbox-efectivo"
              value="efectivo"
              checked={selectedPaymentMethod === "efectivo"}
              onChange={handleEfectivoChange}
              className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="checkbox-efectivo" className="font-semibold">
              Efectivo
            </label>
          </div>
          <p>Pagas al recibir la compra</p>
        </div>
      </div>
    </>
  );
}

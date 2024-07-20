import { useContext, useEffect } from "react";
import classNames from "classnames";
import shipping from "/src/pages/shipping/shipping.module.css";
import { UserContext } from "../../context/UserContext";
import { CheckoutContext } from "../../context/CheckoutContext";

export function PaymentMethods() {
  const { user, userCreditCards, userToken, setUserCreditCards } =
    useContext(UserContext);
  const {
    selectedPaymentMethod,
    handleCheckboxChange,
    handleEfectivoChange,
    capitalizeFirstLetter,
  } = useContext(CheckoutContext);

  const handleUserCards = async () => {
    try {
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/usuarios/usuario/metodosPago/?idUsuario=${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener tarjetas");
      }
      const data = await response.json();
      setUserCreditCards(data.metodos);

      return data;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      handleUserCards();
    }
  }, [user, user.id]);

  const maskCardNumber = (cardNumber) => {
    return cardNumber.slice(0, -4).replace(/\d/g, "*") + cardNumber.slice(-4);
  };

  const formatExpirationDate = (date) => {
    return date.slice(0, 2) + "/" + date.slice(2);
  };

  return (
    <>
      <div className={classNames("p-4", shipping.billing_box)}>
        <h2>Elige tu medio de pago</h2>
        {userCreditCards.map((paymentMethod) => (
          <div
            key={paymentMethod.id}
            className={classNames(
              "credit_card",
              shipping.delivery_type_container,
              shipping.delivery,
              paymentMethod.tipo
            )}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`checkbox-${paymentMethod.id}`}
                value={paymentMethod.id}
                checked={selectedPaymentMethod === paymentMethod.id}
                onChange={() => handleCheckboxChange(paymentMethod.id)}
                className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <label
                htmlFor={`checkbox-${paymentMethod.id}`}
                className="font-semibold"
              >
                {capitalizeFirstLetter(paymentMethod.tipo_tarjeta)}
              </label>
            </div>
            <p>
              Número de tarjeta: {maskCardNumber(paymentMethod.numero_tarjeta)}
            </p>
            <p>
              Fecha de expiración:{" "}
              {formatExpirationDate(paymentMethod.fecha_expiracion)}
            </p>
          </div>
        ))}
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

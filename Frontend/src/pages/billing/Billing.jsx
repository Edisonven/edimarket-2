import { useContext, useEffect, useRef, useState } from "react";
import summary from "../../components/summary/summary.module.css";
import billing from "./billing.module.css";
import classNames from "classnames";
import { PaymentMethods } from "../../components/paymentMethods/PaymentMethods";
import { Summary } from "../../components/summary/Summary";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { ThreeDots } from "react-loader-spinner";
import { CheckoutContext } from "../../context/CheckoutContext";
import { CartContext } from "../../context/CarritoContext";
import { UserContext } from "../../context/UserContext";
import { NoPaymentMethodsAdded } from "../../components/noPaymentMethodsAdded/NoPaymentMethodsAdded";
import { ProductContext } from "../../context/ProductContext";

export function Billing() {
  const { userToken, userCreditCards } = useContext(UserContext);
  const { selectedPaymentMethod, isLoading } = useContext(CheckoutContext);

  const { cart } = useContext(CartContext);
  const { directBuy } = useContext(ProductContext);
  const formRef = useRef(null);

  const [paymentData, setPaymentData] = useState({
    token: "",
    url: "",
  });

  const totalPrecio = cart.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const totalPrecioDirectBuy = directBuy?.precio * directBuy?.cantidad;

  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  const generateUniqueBuyOrder = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendToPayInTransbank = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          "https://backend-mu-three-82.vercel.app/webpayplus/transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              buyOrder: generateUniqueBuyOrder(),
              sessionId: generateSessionId(),
              amount: totalPrecio || totalPrecioDirectBuy,
              returnUrl: "http://localhost:5173/compra-exitosa",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error de datos");
        }

        const data = await response.json();
        setPaymentData({
          token: data.token,
          url: data.url,
        });

        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al procesar el envío de pago");
      throw error;
    }
  };

  useEffect(() => {
    if (paymentData.url && paymentData.token) {
      const form = formRef.current;
      if (form) {
        form.action = paymentData.url;
        form.elements["token_ws"].value = paymentData.token;
        form.submit();
      }
    }
  }, [paymentData]);

  return (
    <div className={classNames("pt-10", billing.billing__container)}>
      {userCreditCards.length ? (
        <div>
          <h1 className="mb-10 ml-5">¿Cómo quieres pagar?</h1>
          <div className="flex  lg:mx-28 flex-col md:flex-row gap-6 md:gap-0">
            <div className="delivery w-full md:w-2/3">
              <PaymentMethods />
            </div>
            <div className="p-4 summary_container w-full md:w-1/3 bg-white m-0 md:ml-8">
              <Summary />
              <div className="">
                <GeneralBtn
                  className={classNames("mt-8", summary.summary__button, {
                    [summary["summary__button--disabled"]]:
                      !selectedPaymentMethod ||
                      (cart.length === 0 && directBuy === null),
                  })}
                  type="primary"
                  onClick={handleSendToPayInTransbank}
                  disabled={
                    !selectedPaymentMethod ||
                    (cart.length === 0 && directBuy === null)
                  }
                >
                  Ir a pagar
                </GeneralBtn>
                <form
                  ref={formRef}
                  id="payment-form"
                  method="POST"
                  action={paymentData.url}
                  style={{ display: "none" }}
                >
                  <input
                    type="hidden"
                    name="token_ws"
                    value={paymentData.token}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoPaymentMethodsAdded />
      )}
    </div>
  );
}

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
import { Loader } from "../../components/loader/Loader";
import config from "../../config/config";

export function Billing() {
  const { userToken, userCreditCards } = useContext(UserContext);
  const { selectedPaymentMethod } = useContext(CheckoutContext);
  const { cart } = useContext(CartContext);
  const { directBuy, loading } = useContext(ProductContext);
  const formRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const [paymentData, setPaymentData] = useState({
    token: "",
    url: "",
  });

  const totalPrecio = cart.reduce(
    (acc, producto) =>
      acc +
      (producto.precio_oferta ? producto.precio_oferta : producto.precio) *
        producto.cantidad,
    0
  );

  const totalPrecioDirectBuy =
    (directBuy?.precio_oferta ? directBuy.precio_oferta : directBuy.precio) *
    directBuy?.cantidad;

  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  const generateUniqueBuyOrder = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendToPayInTransbank = async () => {
    setPaymentLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/webpayplus/transaction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              buyOrder: generateUniqueBuyOrder(),
              sessionId: generateSessionId(),
              amount: parseInt(totalPrecio) || parseInt(totalPrecioDirectBuy),
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
    } finally {
      setPaymentLoading(false);
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
      {loading ? (
        <Loader />
      ) : (
        <div>
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
                      onClick={
                        selectedPaymentMethod === "webpay"
                          ? handleSendToPayInTransbank
                          : null
                      }
                      disabled={
                        !selectedPaymentMethod ||
                        (cart.length === 0 && directBuy === null)
                      }
                    >
                      {paymentLoading ? (
                        <div className="flex items-center justify-center">
                          <ThreeDots
                            visible={true}
                            height="25"
                            width="100"
                            color="#FFFFFF"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      ) : selectedPaymentMethod === "webpay" ? (
                        "Ir a pagar"
                      ) : selectedPaymentMethod === "efectivo" ? (
                        "Realizar pedido"
                      ) : (
                        "Ir a pagar"
                      )}
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
      )}
    </div>
  );
}

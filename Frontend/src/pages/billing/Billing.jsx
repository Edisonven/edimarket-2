import { useState, useContext, useEffect } from "react";
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
  const { userToken, userCreditCards, handleAddedToCart, fetchOrders } =
    useContext(UserContext);
  const { selectedPaymentMethod, isLoading, setIsLoading, navigate } =
    useContext(CheckoutContext);
  const { cart } = useContext(CartContext);
  const { directBuy, setDirectBuy } = useContext(ProductContext);

  const handleDeleteUserProducts = async (usuario_id) => {
    try {
      if (userToken) {
        for (const producto of cart) {
          const response = await fetch(
            `http://localhost:3000/carrito/${producto.producto_id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                usuario_id,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Error al eliminar del carrito"
            );
          }
          const data = await response.json();
        }

        handleAddedToCart();
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const handleOrder = async () => {
    try {
      const sendProduct = async (producto) => {
        const response = await fetch(`http://localhost:3000/venta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            idProducto: producto.producto_id,
            cantidad: producto.cantidad,
          }),
        });

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }

        const data = await response.json();
        return data;
      };

      for (const producto of cart) {
        await sendProduct(producto);
      }

      if (directBuy !== null) {
        await sendProduct(directBuy);
      }
      fetchOrders();
      setDirectBuy(null);
      handleDeleteUserProducts();
      handleAddedToCart();
    } catch (error) {
      console.error("Error al realizar la compra:", error);
    }
  };

  const handleButtonClickPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/compra-exitosa");
    }, 1500);
  };

  const handleClick = () => {
    handleButtonClickPayment();
    handleOrder();
  };

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
                  onClick={() => {
                    handleClick();
                  }}
                  disabled={
                    !selectedPaymentMethod ||
                    (cart.length === 0 && directBuy === null)
                  }
                >
                  {isLoading ? (
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
                  ) : (
                    "Realizar pago"
                  )}
                </GeneralBtn>
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

import "../fullCart/fullCart.css";
import summary from "../../components/summary/summary.module.css";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext.jsx";
import { UserContext } from "../../context/UserContext";
import cartStyle from "../../components/fullCart/cart.module.css";
import { Summary } from "../summary/Summary";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { CgMathMinus } from "react-icons/cg";
import { IoAlertCircleOutline } from "react-icons/io5";
import { EmptyCart } from "../emptyCart/EmptyCart.jsx";
import config from "../../config/config";
import { ProductContext } from "../../context/ProductContext";
import { Loader } from "../loader/Loader";
import { RotatingLines } from "react-loader-spinner";

export function FullCart() {
  const {
    cart,
    setCart,
    formatearPrecio,
    handleAddedToCart,
    handleUpdateQuantity,
    loadingModalCart,
  } = useContext(CartContext);
  const { user, userToken } = useContext(UserContext);
  const { loading, handleProductDetail, setDirectBuy } =
    useContext(ProductContext);
  const navigate = useNavigate();
  const [stockAlert, setStockAlert] = useState("");

  const handleDeleteProduct = async (product_id, usuario_id) => {
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/carrito/${product_id}`,
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
          throw new Error(errorData.message || "Error al eliminar del carrito");
        }
        const data = response.json();
        handleAddedToCart();
        setStockAlert("");
        return data;
      } else {
        return;
      }
    } catch (error) {
      console.error("Error al elimninar del carrito:", error);
    }
  };

  const handleNextStep = () => {
    navigate("/shipping");
  };

  const handleAddQuantity = (id) => {
    const productInCart = cart.find((product) => product.producto_id === id);
    if (productInCart) {
      const updatedProduct = {
        ...productInCart,
        cantidad: productInCart.cantidad + 1,
      };

      const updatedCart = cart.map((product) =>
        product.producto_id === id ? updatedProduct : product
      );

      handleUpdateQuantity(id, updatedProduct.cantidad);
      setCart(updatedCart);
    }
  };

  const handleRestQuantity = (id) => {
    const productInCart = cart.find((product) => product.producto_id === id);

    if (productInCart.cantidad > 1) {
      const updatedProduct = {
        ...productInCart,
        cantidad: productInCart.cantidad - 1,
      };

      const updatedCart = cart.map((product) =>
        product.producto_id === id ? updatedProduct : product
      );

      handleUpdateQuantity(id, updatedProduct.cantidad);
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    const newCart = cart.filter((product) => product.cantidad > product.stock);

    if (newCart.length > 0) {
      setStockAlert("Stock Insuficiente");
    } else {
      setStockAlert("");
    }
  }, [cart]);

  useEffect(() => {
    setDirectBuy(null);
  }, []);
  return (
    <div className="fullcart__container pt-10">
      <div>
        {loading ? (
          <Loader />
        ) : (
          <div>
            {cart.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center">
                <div
                  className={classNames(
                    "w-full shadow-sm",
                    "md:w-2/3",
                    "p-4",
                    cartStyle.cart_box
                  )}
                >
                  <div className="">
                    <h1 className="ml-5 mb-10">Tus productos</h1>
                    {cart.map((element) => (
                      <div key={element?.carro_id}>
                        <div
                          className={classNames(
                            "product__body__cart overflow-hidden border-t border-gray-400 py-5",
                            cartStyle.product_container
                          )}
                        >
                          <div className="flex overflow-hidden gap-3 w-full">
                            <img
                              className="cart__img shadow-md"
                              src={element?.imagen}
                              alt="producto"
                            />
                            <div className="overflow-hidden w-full">
                              <div className="flex gap-0 lg:gap-[70px] w-full flex-wrap">
                                <div
                                  onClick={() =>
                                    handleProductDetail(element?.producto_id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <p className="card__card__paragraph w-[250px] text-l text-ellipsis whitespace-nowrap overflow-hidden mb-2 sm:w-[450px] md:mb-0">
                                    {element?.nombre}
                                  </p>
                                </div>

                                <div className="flex items-center gap-4 mb-5 md:w-[200px] md:mb-0 ">
                                  <div>
                                    <div className="flex items-center gap-4">
                                      <div className="cart__product__add w-[95px] flex items-center justify-between rounded bg-gray-100 p-1 relative shadow select-none">
                                        <CgMathMinus
                                          onClick={() =>
                                            handleRestQuantity(
                                              element?.producto_id
                                            )
                                          }
                                          className="icon text-2xl cursor-pointer hover:bg-slate-200 rounded"
                                        />
                                        {loadingModalCart ? (
                                          <div className="">
                                            <RotatingLines
                                              visible={true}
                                              width="20"
                                              color="grey"
                                              strokeWidth="5"
                                              animationDuration="0.75"
                                              ariaLabel="rotating-lines-loading"
                                            />
                                          </div>
                                        ) : (
                                          <span className="px-3">
                                            {element?.cantidad}
                                          </span>
                                        )}
                                        <CgMathPlus
                                          onClick={() => {
                                            element?.cantidad > element?.stock
                                              ? null
                                              : handleAddQuantity(
                                                  element?.producto_id
                                                );
                                          }}
                                          className="icon text-2xl cursor-pointer hover:bg-slate-200 rounded"
                                        />
                                      </div>
                                      {element.precio_oferta ? (
                                        <div className="flex flex-col items-center">
                                          {element.precio_oferta ? (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-teal-600 font-medium">
                                                {parseFloat(
                                                  element.descuento_aplicado
                                                ) + "%"}
                                              </span>
                                              <span
                                                className={`${
                                                  element?.precio_oferta
                                                    ? "line-through text-sm text-gray-400"
                                                    : "font-medium text-xl"
                                                } `}
                                              >
                                                <div className=" flex items-center gap-2">
                                                  {formatearPrecio(
                                                    element.precio *
                                                      element.cantidad
                                                  )}
                                                </div>
                                              </span>
                                            </div>
                                          ) : (
                                            ""
                                          )}

                                          {element?.precio_oferta ? (
                                            <div className="font-medium text-xl flex flex-col items-center gap-2">
                                              <span>
                                                {formatearPrecio(
                                                  element.precio_oferta *
                                                    element.cantidad
                                                )}
                                              </span>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      ) : (
                                        <span className="font-medium text-xl">
                                          {formatearPrecio(
                                            element?.precio * element.cantidad
                                          )}
                                        </span>
                                      )}
                                    </div>
                                    {element?.cantidad > element?.stock ? (
                                      <div className="flex items-center gap-1 absolute text-red-600">
                                        <IoAlertCircleOutline className="scale-110" />
                                        <p className="font-semibold text-sm">
                                          {stockAlert}
                                        </p>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs font-medium mb-2 text-gray-800">
                                  Disponible {element?.stock}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(
                                      element?.producto_id,
                                      user.id
                                    )
                                  }
                                  className="text-sm font-semibold mt-2 sm:hover:text-teal-500"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 w-full md:w-1/4 bg-white m-0 md:ml-8 shadow-sm rounded-md h-max min-w-[300px]">
                  <Summary />
                  <div>
                    <GeneralBtn
                      onClick={stockAlert ? null : handleNextStep}
                      type="primary"
                      className={classNames("mt-8", summary.summary__button, {
                        [summary["summary__button--disabled"]]: stockAlert,
                      })}
                    >
                      Continuar compra
                    </GeneralBtn>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyCart />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

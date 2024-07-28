import "../carritoModal/carritoModal.css";
import { useContext, useEffect } from "react";
import { CartContext } from "../../context/CarritoContext";
import { IoCloseOutline } from "react-icons/io5";
import { ProductCard } from "../productCard/ProductCard";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import { useNavigate } from "react-router-dom";
import { TbTrashXFilled } from "react-icons/tb";
import { UserContext } from "../../context/UserContext";
import config from "../../config/config";

export function CarritoModal() {
  const { cartModal, setCartModal, cart } = useContext(CartContext);
  const { user, userToken, handleAddedToCart } = useContext(UserContext);

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

        return data;
      } else {
        return;
      }
    } catch (error) {
      console.error("Error al elimninar del carrito:", error);
    }
  };

  useEffect(() => {
    if (cart.length <= 0) {
      setCartModal(false);
    }
  }, [cart]);

  const closeCartModal = () => {
    if (cartModal) {
      setCartModal(false);
    }
  };

  const navigate = useNavigate();

  const handleNavigateToCart = () => {
    navigate("/carro");
  };

  return (
    <section className="cartmodal__container rounded-md">
      {cartModal ? (
        <div className="cartmodal__body rounded-md shadow">
          <IoCloseOutline
            onClick={closeCartModal}
            className="cartmodal__icon"
          />
          <h1 className="cartmodal__title text-center font-medium mt-3">
            Agregaste al carrito{" "}
            <span className="font-normal text-sm">
              ({cart.length} Productos)
            </span>
          </h1>
          <div className="cart__cards__container">
            {cart.map((element) => (
              <ProductCard key={element.carro_id}>
                <div className="cart__card__body">
                  <img
                    className="cart__card__img shadow-md"
                    src={element.imagen}
                    alt=""
                  />
                  <p className="card__card__paragraph text-md font-light">
                    {element.nombre}
                  </p>
                  <TbTrashXFilled
                    onClick={() =>
                      handleDeleteProduct(element.producto_id, user.id)
                    }
                    className="cartmodal__trash__icon"
                  />
                </div>
              </ProductCard>
            ))}
          </div>
          <div className="card__button__container">
            <GeneralBtn onClick={handleNavigateToCart}>
              <div className="card__button">Ir al carrito</div>
            </GeneralBtn>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}

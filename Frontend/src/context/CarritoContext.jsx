import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { ProductContext } from "./ProductContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartModal, setCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { userToken } = useContext(UserContext);
  const { setLoading } = useContext(ProductContext);

  const handleAddedToCart = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          "https://backend-mu-three-82.vercel.app/carrito",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al obtener datos del carro"
          );
        }

        const data = await response.json();
        setCart(data);
        return data;
      } else {
        return;
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAddedToCart();
  }, [userToken]);

  const openModalCart = () => {
    if (!cartModal) {
      setCartModal(true);
    }
  };

  useEffect(() => {
    if (navigate) {
      setCartModal(false);
    }
  }, [navigate]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

  return (
    <CartContext.Provider
      value={{
        cartModal,
        setCartModal,
        openModalCart,
        cart,
        setCart,
        formatearPrecio,
        handleAddedToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

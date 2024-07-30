import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { ProductContext } from "./ProductContext";
import config from "../config/config";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartModal, setCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { userToken, inputRefs } = useContext(UserContext);
  const { setLoading, setProductAlert } = useContext(ProductContext);
  const [loadingAddedToCart, setLoadingAddedToCart] = useState(false);

  const handleAddedToCart = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(`${config.backendUrl}/carrito`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
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

  const handleAddToCart = async (idUsuario, idProducto, cantidad) => {
    setLoadingAddedToCart(true);
    try {
      const productAdded = cart.find(
        (producto) => producto.producto_id === idProducto
      );
      if (productAdded) {
        setProductAlert({
          success: "",
          error: "Ya añadiste este producto al carrito.",
        });
        openModalCart();
        inputRefs.timeoutRef.current = setTimeout(() => {
          setProductAlert((prevState) => ({
            ...prevState,
            error: "",
          }));
          inputRefs.timeoutRef.current = null;
        }, 2400);
      } else {
        if (userToken) {
          const response = await fetch(`${config.backendUrl}/carrito`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              idUsuario,
              idProducto,
              cantidad,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al agregar al carrito");
          }
          const data = response.json();
          openModalCart();
          handleAddedToCart();
          return data;
        } else {
          setProductAlert((prevState) => ({
            ...prevState,
            errorFav: "Para agregar al carrito ingresa a tu cuenta.",
          }));
        }
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    } finally {
      setLoadingAddedToCart(false);
    }
  };

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

  const handleUpdateQuantity = async (id, cantidad) => {
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/carrito/update-quantity`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              quantity: cantidad,
              idProducto: id,
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error de datos");
        }
        const data = response.json();
        handleAddedToCart();
        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al actualizar cantidad");
    }
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
        handleAddToCart,
        loadingAddedToCart,
        setLoadingAddedToCart,
        handleUpdateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

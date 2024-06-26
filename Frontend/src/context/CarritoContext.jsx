import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartModal, setCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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

  return (
    <CartContext.Provider
      value={{
        cartModal,
        setCartModal,
        openModalCart,
        cart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

import { createContext, useState, useEffect, useContext } from "react";
import { CartContext } from "./CarritoContext";
import { ProductContext } from "./ProductContext";
import { UserContext } from "./UserContext";
import { CheckoutContext } from "./CheckoutContext";

export const BillingContext = createContext();

export function BillingProvider({ children }) {
  const { cart } = useContext(CartContext);
  const { directBuy, setDirectBuy } = useContext(ProductContext);
  const { handleAddedToCart, fetchOrders, userToken } = useContext(UserContext);
  const { setIsLoading, navigate } = useContext(CheckoutContext);

  const [updateLastStock, setUpdateLastStock] = useState({
    cartValue: [],
    directBuyValue: 0,
  });

  useEffect(() => {
    const updatedCart = cart.map((product) => ({
      producto_id: product.producto_id,
      newStock: product.stock - product.cantidad,
    }));

    setUpdateLastStock((prevsate) => ({
      ...prevsate,
      cartValue: updatedCart,
    }));
  }, [cart]);

  useEffect(() => {
    const updateStock = directBuy?.stock - directBuy?.cantidad;

    if (updateStock) {
      setUpdateLastStock((prevstock) => ({
        ...prevstock,
        directBuyValue: updateStock,
      }));
    }
  }, [directBuy]);

  const handleDeleteUserProducts = async (usuario_id) => {
    try {
      if (userToken) {
        for (const producto of cart) {
          const response = await fetch(
            `https://backend-mu-three-82.vercel.app/carrito/${producto?.producto_id}`,
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
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/venta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              idProducto: producto.producto_id,
              cantidad: producto.cantidad,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }

        const data = await response.json();
        return data;
      };

      const sendSecondProduct = async (producto) => {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/venta/valorar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              idProducto: producto.producto_id,
              cantidad: producto.cantidad,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error en la segunda solicitud");
        }

        const data = await response.json();
        return data;
      };

      for (const producto of cart) {
        await sendProduct(producto);
        await sendSecondProduct(producto);
      }

      if (directBuy !== null) {
        await sendProduct(directBuy);
        await sendSecondProduct(directBuy);
      }

      handleUpdateProductStock();
      fetchOrders();
      setDirectBuy(null);
      handleDeleteUserProducts();
      handleAddedToCart();
    } catch (error) {
      console.error("Error al realizar la compra:", error);
    }
  };

  const handleUpdateProductStock = async () => {
    try {
      const senDirectBuyStock = async () => {
        const response = await fetch(
          "https://backend-mu-three-82.vercel.app/productos/updatestock",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              productId: directBuy?.producto_id,
              newStock: updateLastStock?.directBuyValue,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar stock");
        }
        const data = await response.json();
        return data;
      };

      await senDirectBuyStock();

      const sendProductInCartStock = async (updateProductCart) => {
        const response = await fetch(
          "https://backend-mu-three-82.vercel.app/productos/updatestock",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              productId: updateProductCart?.producto_id,
              newStock: updateProductCart?.newStock,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar stock");
        }
        const data = await response.json();
        return data;
      };

      for (const updateProductCart of updateLastStock.cartValue) {
        await sendProductInCartStock(updateProductCart);
      }
    } catch (error) {
      console.error(error.message || "Error al actualizar stock del producto");
      throw error;
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
    <BillingContext.Provider value={{ handleClick }}>
      {children}
    </BillingContext.Provider>
  );
}
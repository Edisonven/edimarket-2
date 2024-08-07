import { createContext, useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import { ProductContext } from "./ProductContext";
import { UserContext } from "./UserContext";
import config from "../config/config";

export const BillingContext = createContext();

export function BillingProvider({ children }) {
  const { cart, handleAddedToCart } = useContext(CartContext);
  const { directBuy, setDirectBuy } = useContext(ProductContext);
  const { fetchOrders, userToken } = useContext(UserContext);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [transactionData, setTransactionData] = useState("");
  const [updateLastStock, setUpdateLastStock] = useState({
    cartValue: [],
    directBuyValue: 0,
  });
  const [isCartReady, setIsCartReady] = useState(false);

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

  useEffect(() => {
    if (transactionConfirmed) {
      if (
        updateLastStock.cartValue.length > 0 ||
        updateLastStock.directBuyValue > 0
      ) {
        setIsCartReady(true);
      } else {
        setIsCartReady(false);
      }
    }
  }, [transactionConfirmed, updateLastStock]);

  useEffect(() => {
    if (isCartReady && transactionConfirmed) {
      handleOrder();
      setTransactionConfirmed(false);
      setIsCartReady(false);
    }
  }, [isCartReady, transactionConfirmed]);

  const handleDeleteUserProducts = async (usuario_id) => {
    try {
      if (userToken) {
        for (const producto of cart) {
          const response = await fetch(
            `${config.backendUrl}/carrito/${producto?.producto_id}`,
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
          await response.json();
        }

        await handleAddedToCart();
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const handleOrder = async () => {
    try {
      const sendProduct = async (producto, transactionData) => {
        const response = await fetch(`${config.backendUrl}/venta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            idProducto: producto.producto_id,
            cantidad: producto.cantidad,
            buy_order: transactionData,
          }),
        });

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }

        const data = await response.json();
        return data;
      };

      const sendSecondProduct = async (producto, order) => {
        const response = await fetch(`${config.backendUrl}/venta/valorar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            idProducto: producto.producto_id,
            cantidad: producto.cantidad,
            buy_order: order,
          }),
        });

        if (!response.ok) {
          throw new Error("Error en la segunda solicitud");
        }

        const data = await response.json();
        return data;
      };

      if (directBuy === null) {
        for (const producto of cart) {
          await sendProduct(producto, transactionData);
          await sendSecondProduct(producto, transactionData);
        }
      }

      if (directBuy !== null) {
        await sendProduct(directBuy, transactionData);
        await sendSecondProduct(directBuy, transactionData);
      }

      await handleUpdateProductStock();
      await fetchOrders();
      setDirectBuy(null);
      await handleDeleteUserProducts();
      await handleAddedToCart();
    } catch (error) {
      console.error("Error al realizar la compra:", error);
    }
  };

  const handleUpdateProductStock = async () => {
    try {
      const senDirectBuyStock = async () => {
        const response = await fetch(
          `${config.backendUrl}/productos/updatestock`,
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

      if (updateLastStock.directBuyValue > 0) {
        await senDirectBuyStock();
      }

      const sendProductInCartStock = async (updateProductCart) => {
        const response = await fetch(
          `${config.backendUrl}/productos/updatestock`,
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

  return (
    <BillingContext.Provider
      value={{
        handleOrder,
        transactionConfirmed,
        setTransactionConfirmed,
        setTransactionData,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

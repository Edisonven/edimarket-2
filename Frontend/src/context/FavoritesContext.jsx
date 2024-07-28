import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { ProductContext } from "./ProductContext";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [changeHeartColor, setChangeHeartColor] = useState("");
  const [addedToFav, setAddedToFav] = useState([]);
  const { userToken, inputRefs } = useContext(UserContext);
  const { setLoading, productById, setProductAlert } =
    useContext(ProductContext);

  const handleGetFavs = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          "https://backend-mu-three-82.vercel.app/favoritos",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener favoritos");
        }

        const data = await response.json();
        setAddedToFav(data.favoritos);
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

  const handleDeleteFav = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/favoritos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            usuario_id: addedToFav.usuario_id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar favorito");
      }

      const data = await response.json();
      handleGetFavs();
      setProductAlert((prevState) => ({
        ...prevState,
        success: "",
        errorFav: "Producto eliminado de favoritos.",
      }));

      inputRefs.timeoutRef.current = setTimeout(() => {
        setProductAlert((prevState) => ({
          ...prevState,
          errorFav: "",
        }));
        inputRefs.timeoutRef.current = null;
      }, 2400);

      return data;
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      handleGetFavs();
    }
    if (!userToken) {
      setAddedToFav([]);
    }
  }, [userToken]);

  const handleAddToFav = async (id) => {
    try {
      const productFinded = addedToFav.find(
        (product) => product.producto_id === productById.producto_id
      );
      if (!productFinded) {
        setChangeHeartColor(id);
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/favoritos/${productById.producto_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              usuario_id: productById.vendedor_id,
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar el favorito");
        }
        handleGetFavs();
        setProductAlert({
          success: "¡Producto añadido a favoritos!.",
          error: "",
        });

        inputRefs.timeoutRef.current = setTimeout(() => {
          setProductAlert((prevState) => ({
            ...prevState,
            success: "",
          }));
          inputRefs.timeoutRef.current = null;
        }, 2400);

        const data = response.json();

        return data;
      } else {
        setChangeHeartColor("");
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/favoritos/${productFinded.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              usuario_id: addedToFav.usuario_id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar favorito");
        }

        const data = await response.json();
        handleGetFavs();
        setProductAlert({
          success: "",
          error: "Producto eliminado de favoritos.",
        });

        inputRefs.timeoutRef.current = setTimeout(() => {
          setProductAlert((prevState) => ({
            ...prevState,
            error: "",
          }));
          inputRefs.timeoutRef.current = null;
        }, 2400);

        return data;
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };
  return (
    <FavoritesContext.Provider
      value={{ handleAddToFav, changeHeartColor, handleDeleteFav, addedToFav }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

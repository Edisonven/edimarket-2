import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productById, setProductById] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [addedToFav, setAddedToFav] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleProductDetail = (id) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      // Verificar si el producto ya está presente
      const isProductAlreadyAdded = productById.id === id;

      // Si el producto no está presente, lo añadimos
      if (!isProductAlreadyAdded) {
        setProductById(product);
      }
      navigate(`/product/${id}`);
    } else {
      console.log("Producto no encontrado");
    }
  };

  const addToFav = (product) => {
    const productFavIndex = addedToFav.findIndex(
      (item) => item.id === product.id
    );
    if (productFavIndex !== -1) {
      return;
    }

    setAddedToFav((prevState) => [
      ...prevState,
      {
        ...product,
        like: true,
      },
    ]);
  };

  const handleProductQuantity = (e) => {
    setProductQuantity(Number(e.target.value));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        productById,
        setProductById,
        addedProducts,
        setAddedProducts,
        openCategories,
        setOpenCategories,
        handleProductDetail,
        addToFav,
        addedToFav,
        setAddedToFav,
        productQuantity,
        setProductQuantity,
        handleProductQuantity,
        loading,
        setLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

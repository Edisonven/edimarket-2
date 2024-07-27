import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext();

const initialStateProduct = localStorage.getItem("directBuy")
  ? JSON.parse(localStorage.getItem("directBuy"))
  : null;
const initialStateProductToRate = localStorage.getItem("productToRate")
  ? JSON.parse(localStorage.getItem("productToRate"))
  : null;

const initialStateScore = initialStateProductToRate
  ? initialStateProductToRate.score
  : 0;

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productById, setProductById] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [addedToFav, setAddedToFav] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [findedProduct, setFindedProduct] = useState([]);
  const [prevPage, setPrevPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [order_by, setOrder_by] = useState("fecha_desc");
  const [totalProducts, setTotalProducts] = useState(0);
  const [directBuy, setDirectBuy] = useState(initialStateProduct);
  const [questionsByProductId, setQuestionsByProductId] = useState([]);
  const [productToRate, setProductToRate] = useState(initialStateProductToRate);
  const [score, setScore] = useState(initialStateScore);
  const [userValorations, setUserValorations] = useState([]);
  const [serverError, setServerError] = useState({
    myPostGetError: "",
  });

  const handleGetUserValorations = async () => {
    setLoading(true);
    try {
      if (productById) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/productos/valoracion/${productById?.producto_id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al obtener las valoraciones"
          );
        }

        const data = await response.json();

        setUserValorations(data?.valoraciones);
        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al obtener las valoraciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserValorations();
  }, [productById]);

  const handleGetQuestionsByProductId = async () => {
    setLoading(true);
    try {
      if (productById) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/productos/preguntas/${productById?.producto_id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener preguntas");
        }

        const data = await response.json();
        setQuestionsByProductId(data.preguntas);
      }
    } catch (error) {
      console.error("Error al obtener preguntas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetQuestionsByProductId();
  }, [productById]);

  const handleDirectBuy = (cantidad, cart) => {
    setDirectBuy((prevData) => ({
      ...prevData,
      ...productById,
      cantidad: cantidad,
    }));

    const productInCart = cart.find(
      (cart) => cart.producto_id === directBuy.producto_id
    );
    if (productInCart) {
      navigate("/carro");
    } else {
      navigate("/shipping");
    }
  };

  useEffect(() => {
    localStorage.setItem("directBuy", JSON.stringify(directBuy));
  }, [directBuy]);

  const [productAlert, setProductAlert] = useState({
    succes: "",
    error: "",
    errorFav: "",
  });

  useEffect(() => {
    setProductAlert({
      succes: "",
      error: "",
      errorFav: "",
      errorCart: "",
    });
    setProductQuantity(1);
  }, [navigate]);

  useEffect(() => {
    setOrder_by("fecha_desc");
  }, [navigate]);

  const getUserById = async (vendedor_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/usuarios/${vendedor_id}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener usuario");
      }
      const data = await response.json();
      setSeller(data);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productById && productById.vendedor_id) {
      getUserById(productById.vendedor_id);
    }
  }, [productById]);

  const handleGetProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/productos?page=${page}&limits=${limit}&order_by=${order_by}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener productos");
      }

      const {
        results,
        anterior_pagina,
        siguiente_pagina,
        productos_total_pagina,
        productos_total,
      } = await response.json();

      // Formatear el precio a peso chileno
      const formattedProducts = results.map((product) => ({
        ...product,
        precio: new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(product.precio),
      }));

      setProducts(formattedProducts);
      setTotalPage(productos_total_pagina);
      setNextPage(siguiente_pagina);
      setPrevPage(anterior_pagina);
      setTotalProducts(productos_total);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, [page, order_by]);

  const handleGetProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/productos/${id}`
      );
      if (!response.ok) {
        throw new Error("Producto no encontrado");
      }
      const data = await response.json();
      setProduct(data);
      setProductById(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  const handleProductDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const handleProductQuantity = (e) => {
    setProductQuantity(Number(e.target.value));
  };

  useEffect(() => {
    if (productToRate) {
      localStorage.setItem("productToRate", productToRate);
    } else {
      localStorage.removeItem("productToRate");
    }
  }, [productToRate]);

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
        addedToFav,
        setAddedToFav,
        productQuantity,
        setProductQuantity,
        handleProductQuantity,
        loading,
        setLoading,
        product,
        setProduct,
        productAlert,
        setProductAlert,
        handleGetProduct,
        seller,
        handleGetProducts,
        searchProduct,
        setSearchProduct,
        findedProduct,
        setFindedProduct,
        prevPage,
        setPrevPage,
        nextPage,
        setNextPage,
        totalPage,
        setTotalPage,
        page,
        setPage,
        limit,
        setLimit,
        totalProducts,
        directBuy,
        setDirectBuy,
        serverError,
        setServerError,
        handleDirectBuy,
        questionsByProductId,
        handleGetQuestionsByProductId,
        order_by,
        setOrder_by,
        productToRate,
        setProductToRate,
        score,
        setScore,
        userValorations,
        setUserValorations,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

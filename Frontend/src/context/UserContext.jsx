import { createContext, useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import config from "../config/config";

export const UserContext = createContext();

const initialUserData = {
  nombre: "",
  email: "",
  contraseña: "",
  confirmContraseña: "",
  titulo: "",
  precio: "",
  categorias: "",
  estado: "",
  descripcion: "",
  direccion: "",
  region: "",
  comuna: "",
  codigoPostal: "",
  numero: "",
  tipo: "",
  numeroTarjeta: "",
  nombreTitular: "",
  expiracion: "",
  cvv: "",
  postimg: "",
  productStock: "",
  preguntas: "",
};

const initialFormError = {
  errorNombre: "",
  errorEmail: "",
  errorContraseña: "",
  errorConfirmContraseña: "",
  errorTitulo: "",
  errorPrecio: "",
  errorCategorias: "",
  errorEstado: "",
  errorDescripcion: "",
  errorDireccion: "",
  errorRegion: "",
  errorComuna: "",
  errorCodigoPostal: "",
  errorNumero: "",
  errorTipo: "",
  errorNumeroTarjeta: "",
  errorNombreTitular: "",
  errorExpiracion: "",
  errorCvv: "",
  errorPostimg: "",
  errorProductStock: "",
  errorPreguntas: "",
};

const initialStateToken = localStorage.getItem("token") || null;

export function UserProvider({ children }) {
  const [userToken, setUserToken] = useState(initialStateToken);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const rutFormatRegex = /^[0-9]+-[0-9]$/;
  const onlyNumbersRegex = /^[0-9]+$/;
  const image_url_regex = /\bhttps?:\/\/\S+\.(?:png|jpe?g|gif|webp)\b/;
  const regexMalasPalabras = /\b(palabra1|palabra2|palabra3)\b/gi;
  const [userData, setUserData] = useState(initialUserData);
  const [user, setUser] = useState({});
  const [formatedUser, setFormatedUser] = useState("");
  const [userAddress, setUserAddress] = useState([]);
  const [userCreditCards, setUserCreditCards] = useState([]);
  const [inputFormError, setInputFormError] = useState(initialFormError);
  const [myProducts, setMyProducts] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [questionsByUser, setQuestionsByUser] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersToValorate, setOrdersToValorate] = useState([]);
  const [prevPage, setPrevPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [order_by, setOrderBy] = useState("fecha_venta-desc");
  const [AddAddressSuccess, setAddAddressSuccess] = useState({
    success: "",
    error: "",
  });
  const {
    setLoading,
    setDirectBuy,
    setServerError,
    setProductToRate,
    setScore,
  } = useContext(ProductContext);

  const inputRefs = {
    nombre: useRef(null),
    email: useRef(null),
    contraseña: useRef(null),
    confirmContraseña: useRef(null),
    titulo: useRef(null),
    precio: useRef(null),
    categorias: useRef(null),
    estado: useRef(null),
    descripcion: useRef(null),
    direccion: useRef(null),
    region: useRef(null),
    comuna: useRef(null),
    codigoPostal: useRef(null),
    numero: useRef(null),
    tipo: useRef(null),
    numeroTarjeta: useRef(null),
    nombreTitular: useRef(null),
    expiracion: useRef(null),
    cvv: useRef(null),
    postimg: useRef(null),
    productStock: useRef(null),
    timeoutRef: useRef(null),
    preguntasRef: useRef(null),
  };

  useEffect(() => {
    setAddAddressSuccess({
      success: "",
      error: "",
    });
  }, [navigate]);

  const handleGetUserRegistered = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario-token`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error de datos");
        }

        const data = await response.json();

        const newUserModel = data.user[0];
        const newFormatedUser = data.user[0].nombre
          .split(" ")
          .slice(0, 2)
          .join(" ");
        setFormatedUser(newFormatedUser);
        setUser(newUserModel);
        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al obtener usuario");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserRegistered();
  }, [userToken]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const handleOrders = async () => {
          const response = await fetch(
            `${config.backendUrl}/usuarios/usuario/ventas/?idUsuario=${user.id}&page=${page}&limits=${limit}&order_by=${order_by}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error fetching orders");
          }
          const { results, anterior_pagina, siguiente_pagina, count } =
            await response.json();

          setOrders(results);
          setTotal(count);
          setTotalPage(total);
          setPrevPage(anterior_pagina);
          setNextPage(siguiente_pagina);
        };

        const handleOrdersToValorate = async () => {
          const response = await fetch(
            `${config.backendUrl}/usuarios/usuario/valorar/?idUsuario=${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error fetching orders");
          }
          const data = await response.json();

          setOrdersToValorate(data.ventasParaValorar);

          return data;
        };

        await handleOrders();
        await handleOrdersToValorate();
      } else {
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userToken, page]);

  const handleGetQuestionsByUser = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/preguntas/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener preguntas");
        }

        const data = await response.json();
        setQuestionsByUser(data.preguntas);
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
    handleGetQuestionsByUser();
  }, [userToken]);

  const handleUserCards = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario/metodosPago/?idUsuario=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener tarjetas");
        }

        const data = await response.json();

        setUserCreditCards(
          data.metodos.map((d) => {
            return {
              ...d,
            };
          })
        );

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
    handleUserCards();
  }, [userToken]);

  const getProductBySeller = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario/productos`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.status === 500) {
          setServerError((prevData) => ({
            ...prevData,
            myPostGetError:
              "Ha ocurrido un error al obtener tus productos, intentalo de nuevo más tarde.",
          }));
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener producto");
        }

        const data = await response.json();
        setMyProducts(data.productos);
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
    getProductBySeller();
  }, [userToken]);

  const handleUserAddress = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario/domicilio?userId=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener domicilio");
        }

        const data = await response.json();

        setUserAddress(
          data.Domicilio.map((d) => {
            return {
              ...d,
            };
          })
        );

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
    handleUserAddress();
  }, [userToken]);

  // Resetear el estado si cambia la navegación (URL)
  useEffect(() => {
    setUserData(initialUserData);
    setInputFormError(initialFormError);
  }, [navigate]);

  //Manejo de datos ingresados en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]:
        name === "precio" || name === "productStock" ? Number(value) : value,
    }));
  };

  // Resetear los errores si userData cambia
  useEffect(() => {
    setInputFormError(initialFormError);
  }, [userData]);

  // Enfocar el primer input con algún error
  useEffect(() => {
    const shouldFocusInput = Object.keys(inputFormError).some(
      (key) => inputFormError[key]
    );

    if (shouldFocusInput) {
      Object.keys(inputRefs).forEach((key) => {
        if (
          inputFormError[`error${key.charAt(0).toUpperCase() + key.slice(1)}`]
        ) {
          inputRefs[key].current.focus();
        }
      });
    }
  }, [inputFormError]);

  const handleTokenExpired = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/verify-data`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error de datos");
        }
      }
    } catch (error) {
      console.error(error.message);
      if (error.message === "token expirado") {
        alert("Sesión expirada, por favor inicia sesión nuevamente");
        logout();
      }
    }
  };

  useEffect(() => {
    handleTokenExpired();
  }, [userToken, navigate]);

  const logout = () => {
    setUserToken(null);
    setDirectBuy(null);
    setUser(null);
    setProductToRate(null);
    setScore(null);
    navigate("/");
  };

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("token", userToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [userToken]);

  return (
    <UserContext.Provider
      value={{
        emailRegex,
        rutFormatRegex,
        onlyNumbersRegex,
        userData,
        setUserData,
        inputRefs,
        handleChange,
        inputFormError,
        userToken,
        setInputFormError,
        user,
        setUser,
        setUserToken,
        initialUserData,
        logout,
        userAddress,
        setUserAddress,
        userCreditCards,
        setUserCreditCards,
        image_url_regex,
        AddAddressSuccess,
        setAddAddressSuccess,
        handleUserAddress,
        getProductBySeller,
        setMyProducts,
        myProducts,
        handleUserCards,
        selectedAddressId,
        setSelectedAddressId,
        regexMalasPalabras,
        questionsByUser,
        orders,
        setOrders,
        fetchOrders,
        ordersToValorate,
        setOrdersToValorate,
        handleGetUserRegistered,
        formatedUser,
        totalPage,
        page,
        setPage,
        limit,
        setLimit,
        totalPage,
        total,
        setOrderBy,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

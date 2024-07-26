import { createContext, useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import { CartContext } from "./CarritoContext";

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
const initialStateUser = JSON.parse(localStorage.getItem("user")) || null;

export function UserProvider({ children }) {
  const [userToken, setUserToken] = useState(initialStateToken);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const rutFormatRegex = /^[0-9]+-[0-9]$/;
  const onlyNumbersRegex = /^[0-9]+$/;
  const image_url_regex = /\bhttps?:\/\/\S+\.(?:png|jpe?g|gif|webp)\b/;
  const regexMalasPalabras = /\b(palabra1|palabra2|palabra3)\b/gi;
  const [userData, setUserData] = useState(initialUserData);
  const [user, setUser] = useState(initialStateUser);
  const [userAddress, setUserAddress] = useState([]);
  const [userCreditCards, setUserCreditCards] = useState([]);
  const [inputFormError, setInputFormError] = useState(initialFormError);
  const [myProducts, setMyProducts] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [questionsByUser, setQuestionsByUser] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersToValorate, setOrdersToValorate] = useState([]);
  const [AddAddressSuccess, setAddAddressSuccess] = useState({
    success: "",
    error: "",
  });
  const {
    setLoading,
    setAddedToFav,
    addedToFav,
    setProductAlert,
    setDirectBuy,
    setServerError,
    setProductToRate,
    setScore,
  } = useContext(ProductContext);
  const { setCart, cart } = useContext(CartContext);

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

  const fetchOrders = async () => {
    try {
      if (userToken) {
        const handleOrders = async () => {
          const response = await fetch(
            `https://backend-mu-three-82.vercel.app/usuarios/usuario/ventas/?idUsuario=${user.id}`,
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

          setOrders(data.ventas);

          return data;
        };

        const handleOrdersToValorate = async () => {
          const response = await fetch(
            `https://backend-mu-three-82.vercel.app/usuarios/usuario/valorar/?idUsuario=${user.id}`,
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
  }, [userToken]);

  const handleGetQuestionsByUser = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/usuarios/preguntas/${user.id}`,
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
    }
  };

  useEffect(() => {
    handleGetQuestionsByUser();
  }, [userToken]);

  const handleUserCards = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/usuarios/usuario/metodosPago/?idUsuario=${user.id}`,
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
          "https://backend-mu-three-82.vercel.app/usuarios/usuario/productos",
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

  const handleUserAddress = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/usuarios/usuario/domicilio?userId=${user.id}`,
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
          "https://backend-mu-three-82.vercel.app/usuarios/verify-data",
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

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [userToken, user]);

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
        handleGetFavs,
        handleDeleteFav,
        AddAddressSuccess,
        setAddAddressSuccess,
        handleUserAddress,
        handleAddedToCart,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

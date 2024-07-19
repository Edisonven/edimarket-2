import "../productDetail/productDetail.css";
import { useContext, useEffect, useRef, useState, forwardRef } from "react";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { IoHeartSharp } from "react-icons/io5";
import { CartContext } from "../../context/CarritoContext";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OverlayScreen } from "../../components/overlayScreen/OverlayScreen";
import { UserContext } from "../../context/UserContext";
import { Loader } from "../../components/loader/Loader";
import { IoIosClose } from "react-icons/io";
import { IoAlertCircleOutline } from "react-icons/io5";
import visa from "/imgs/aplication/visa.png";
import masterCard from "/imgs/aplication/mastercard.png";
import cash from "/imgs/aplication/cash.png";
import { Comments } from "../../components/comments/Comments";
import { Questions } from "../../components/questions/Questions";

const ModalIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoIosClose {...props} />
  </div>
));
const HeartIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoHeartSharp {...props} />
  </div>
));

export function ProductDetail() {
  const {
    productById,
    addedToFav,
    productQuantity,
    handleProductQuantity,
    loading,
    product,
    productAlert,
    setProductAlert,
    handleGetProduct,
    seller,
    handleDirectBuy,
  } = useContext(ProductContext);
  const { openModalCart, cart } = useContext(CartContext);

  const { userToken, handleGetFavs, inputRefs, user, handleAddedToCart } =
    useContext(UserContext);

  const [visible, setVisible] = useState(productAlert.errorFav ? true : false);
  const formatedSellerName = seller?.nombre?.split(" ").slice(0, 1);
  const navigate = useNavigate();
  const { id } = useParams();
  const errorModal = useRef(null);
  const modalIconRef = useRef(null);
  const heartIconRef = useRef(null);
  const cartBtnRef = useRef(null);

  useEffect(() => {
    handleGetProduct(id);
  }, [id, navigate]);

  const handleAddToCart = async (idUsuario, idProducto, cantidad) => {
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
          const response = await fetch("http://localhost:3000/carrito", {
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
    }
  };

  const handleAddToFav = async () => {
    try {
      const productFinded = addedToFav.find(
        (product) => product.producto_id === productById.producto_id
      );
      if (!productFinded) {
        const response = await fetch(
          `http://localhost:3000/favoritos/${productById.producto_id}`,
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
        const response = await fetch(
          `http://localhost:3000/favoritos/${productFinded.id}`,
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

  const handleNavigateToLogin = async () => {
    if (!userToken) {
      setProductAlert((prevState) => ({
        ...prevState,
        errorFav: "Para añadir a favoritos inicia sesión o registrate.",
      }));
    }
  };

  useEffect(() => {
    if (productAlert.errorFav) {
      setVisible(true);
    }
  }, [productAlert.errorFav]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setProductAlert({ errorFav: "" });
    }, 200);
  };

  const handleClickOutside = (event) => {
    if (
      errorModal.current &&
      modalIconRef.current &&
      heartIconRef.current &&
      cartBtnRef.current &&
      !errorModal.current.contains(event.target) &&
      !modalIconRef.current.contains(event.target) &&
      !cartBtnRef.current.contains(event.target) &&
      !heartIconRef.current.contains(event.target)
    ) {
      setVisible(false);
      setTimeout(() => {
        setProductAlert({ errorFav: "" });
      }, 200);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="productdetail__container">
      {loading ? (
        <Loader />
      ) : (
        <div className="card__container">
          <OverlayScreen />
          <ProductCard className="card__body shadow-md rounded-md">
            <img
              className="card__img"
              src={
                product?.imagen
                  ? product?.imagen
                  : "/imgs/aplication/img-notfound.png"
              }
              alt=""
            />
            <div className="card__info__container">
              <div className="card__info border-2 rounded-md">
                <div className="card__info__details">
                  {product?.stock === 0 ? (
                    <div className="flex items-center gap-2">
                      <IoAlertCircleOutline className="text-red-600 text-2xl" />
                      <span className="text-red-600 font-semibold">
                        Producto sin stock.
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <p className="card__paragraph card__paragraph__name">
                    {product?.nombre}
                  </p>
                  <hr className="mb-5" />
                  <div className="card__info__price__details">
                    <p className="card__paragraph card__paragraph__price">
                      {product?.precio
                        ? Number(product.precio).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                        : null}
                    </p>
                    {user?.id === product?.vendedor_id && userToken ? (
                      ""
                    ) : (
                      <HeartIcon
                        ref={heartIconRef}
                        onClick={
                          userToken ? handleAddToFav : handleNavigateToLogin
                        }
                        className={`card__info__like__icon ${
                          addedToFav?.some(
                            (p) => p?.producto_id === product?.producto_id
                          )
                            ? "text-red-600 transition duration-300"
                            : "text-gray-400 transition duration-300"
                        }`}
                      />
                    )}
                  </div>

                  <p className="card__paragraph card__paragraph__stock">
                    Stock disponible{" "}
                    <span className="font-semibold">{product?.stock}</span>
                  </p>
                  <div className="flex flex-col mb-4">
                    <select
                      disabled={
                        product?.stock === 0 ||
                        (user?.id === product?.vendedor_id && userToken)
                          ? true
                          : false
                      }
                      onChange={handleProductQuantity}
                      value={productQuantity}
                      className="w-1/2 font-medium mb-5 px-2 border rounded-md active: outline-none cursor-pointer"
                      name="quantity"
                      id=""
                    >
                      <option value="1">1 unidad</option>
                      <option value="2">2 unidades</option>
                      <option value="3">3 unidades</option>
                      <option value="4">4 unidades</option>
                      <option value="5">5 unidades</option>
                    </select>
                    {product?.stock < productQuantity ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <IoAlertCircleOutline className="text-xl" />
                        <span className="text-sm font-semibold">
                          La selección supera el stock disponible.
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="mb-4 text-sm">
                    <span className="text-gray-400">
                      Estado{" "}
                      <span className="font-medium">
                        {product?.estado
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                    </span>
                  </div>
                  <div className="mb-4 text-sm">
                    <span className="text-gray-400">
                      Publicado por{" "}
                      <span className="font-medium">{formatedSellerName}</span>
                    </span>
                  </div>
                  {product?.stock === 0 ? (
                    <div className="mb-4 text-sm font-semibold">
                      <span className="text-gray-400">
                        Podrás comprar este producto cuando vuelva a tener
                        stock.
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="card__info__btn__container">
                  {user?.id === product?.vendedor_id && userToken ? (
                    <span className="">
                      Vista previa de tu producto Publicado.
                    </span>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <GeneralBtn
                        onClick={() => handleDirectBuy(productQuantity, cart)}
                        style={{
                          pointerEvents: product?.stock === 0 ? "none" : "auto",
                          cursor:
                            product?.stock === 0 ? "not-allowed" : "pointer",
                          opacity: product?.stock === 0 ? "0.7" : "1",
                          filter:
                            product?.stock === 0
                              ? "brightness(70%)"
                              : "brightness(100%)",
                        }}
                        disabled={
                          product?.stock === 0 ||
                          product?.stock < productQuantity
                            ? true
                            : false
                        }
                        className="card__info__btn card__info__btn__buy"
                        type="secondary"
                      >
                        Comprar ahora
                      </GeneralBtn>
                      <GeneralBtn
                        ref={cartBtnRef}
                        onClick={() =>
                          handleAddToCart(
                            user.id,
                            parseInt(id),
                            productQuantity
                          )
                        }
                        className="card__info__btn card__info__btn__cart"
                        type="primary"
                        style={{
                          pointerEvents: product?.stock === 0 ? "none" : "auto",
                          cursor:
                            product?.stock === 0 ? "not-allowed" : "pointer",
                          opacity: product?.stock === 0 ? "0.7" : "1",
                          filter:
                            product?.stock === 0
                              ? "brightness(70%)"
                              : "brightness(100%)",
                        }}
                        disabled={
                          product?.stock === 0 ||
                          product?.stock < productQuantity
                            ? true
                            : false
                        }
                      >
                        Agregar al carrito
                      </GeneralBtn>
                    </div>
                  )}
                </div>
                <hr className="my-8 sm:mb-0" />
                <div className="card__payment ">
                  <h3 className="mb-4 font-medium">Medios de pago</h3>
                  <div className="flex items-center justify-between">
                    <img className="w-16 aspect-auto" src={visa} alt="" />
                    <img className="w-16 aspect-auto" src={masterCard} alt="" />
                    <img className="w-16 aspect-auto" src={cash} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card__info__desc__container mt-8 p-4">
              <hr />
              <h1 className="card__info__desc__title text-2xl mt-5">
                Descripción
              </h1>
              <div className="card__info__desc mt-10">
                {product?.descripcion}
              </div>
            </div>
            <div className="card__info__questions mt-8 p-4 w-full h-full">
              <hr />
              <Questions vendedor_id={product?.vendedor_id} />
            </div>
            <div className="card__info__desc__comentary mt-8 p-4 w-full">
              <hr />
              <Comments />
            </div>
          </ProductCard>
          {productAlert.error ? (
            <CartAlert>
              <div>
                <p className="card__cart__alert shadow-md rounded-md bg-slate-700">
                  {productAlert.error}
                </p>
              </div>
            </CartAlert>
          ) : (
            ""
          )}
          {productAlert.success ? (
            <CartAlert>
              <div>
                <p className="card__cart__alert shadow-md rounded-md bg-green-600">
                  {productAlert.success}
                </p>
              </div>
            </CartAlert>
          ) : (
            ""
          )}

          <CartAlert
            ref={errorModal}
            style={{
              opacity: visible ? "1" : "0",
              visibility: visible ? "visible" : "hidden",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <div className="card__cart__alert__container">
              <div className="card__cart__alert shadow-lg rounded-md bg-slate-700 text-sm sm:text-lg">
                <div className="flex flex-col">
                  <ModalIcon
                    ref={modalIconRef}
                    onClick={handleClose}
                    className="card__cart__alert__icon"
                  />
                  <span className="font-semibold text-2xl mb-2">¡HOLA!</span>
                  <span>{productAlert.errorFav}</span>
                </div>
                <div className="flex gap-5 items-center justify-center mt-5 ">
                  <Link
                    className="font-bold sm:text-sm bg-gray-200 w-2/5 py-2 px-4 hover:brightness-75 rounded-md text-gray-800"
                    to="/sign-in"
                  >
                    INGRESAR
                  </Link>
                  <Link
                    className="font-bold sm:text-sm bg-gray-200 w-2/5 py-2 px-4 hover:brightness-75 rounded-md text-gray-800"
                    to="/sign-up"
                  >
                    REGISTRARSE
                  </Link>
                </div>
              </div>
            </div>
          </CartAlert>
        </div>
      )}
    </section>
  );
}

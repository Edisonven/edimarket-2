import { forwardRef, useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { UserContext } from "../../context/UserContext";
import { IoHeartSharp } from "react-icons/io5";
import { FavoritesContext } from "../../context/FavoritesContext";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import { CartContext } from "../../context/CartContext";
import visa from "/imgs/aplication/visa.png";
import masterCard from "/imgs/aplication/mastercard.png";
import cash from "/imgs/aplication/cash.png";
import { Questions } from "../questions/Questions";
import { Comments } from "../comments/Comments";
import { ThreeDots } from "react-loader-spinner";
import { IoAlertCircleOutline } from "react-icons/io5";

const HeartIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoHeartSharp {...props} />
  </div>
));

export function ProductCardDetail({
  className,
  heartIconRef,
  formatedSellerName,
  cartBtnRef,
  id,
  setProductAlert,
}) {
  const {
    product,
    productQuantity,
    handleProductQuantity,
    handleDirectBuy,
    formatearPrecio,
  } = useContext(ProductContext);
  const { user, userToken } = useContext(UserContext);
  const { handleAddToFav, addedToFav } = useContext(FavoritesContext);
  const { cart, handleAddToCart, loadingAddedToCart } = useContext(CartContext);

  const handleNavigateToLogin = async () => {
    if (!userToken) {
      setProductAlert((prevState) => ({
        ...prevState,
        errorFav: "Para añadir a favoritos inicia sesión o registrate.",
      }));
    }
  };

  return (
    <div className={`${className} card__body shadow-md rounded-md`}>
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
              <div className="flex flex-col">
                <span
                  className={`${
                    product?.precio_oferta
                      ? "line-through text-sm text-gray-400"
                      : "font-medium text-3xl"
                  } `}
                >
                  {formatearPrecio(product?.precio)}
                </span>
                {product?.precio_oferta ? (
                  <div className="font-medium text-3xl flex items-center gap-2">
                    <span>{formatearPrecio(product.precio_oferta)}</span>
                    <span className="text-[18px] text-teal-600 font-medium">
                      {parseFloat(product.descuento_aplicado) + "%"}{" "}
                      OFF
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {user?.id === product?.vendedor_id && userToken ? (
                ""
              ) : (
                <HeartIcon
                  ref={heartIconRef}
                  onClick={userToken ? handleAddToFav : handleNavigateToLogin}
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
              {product?.stock < productQuantity && product?.stock > 0 ? (
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
                  Podrás comprar este producto cuando vuelva a tener stock.
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card__info__btn__container">
            {user?.id === product?.vendedor_id && userToken ? (
              <span className="">Vista previa de tu producto Publicado.</span>
            ) : (
              <div className="flex flex-col gap-3">
                <GeneralBtn
                  onClick={() => handleDirectBuy(productQuantity, cart)}
                  style={{
                    pointerEvents: product?.stock === 0 ? "none" : "auto",
                    opacity: product?.stock === 0 ? "0.7" : "1",
                    filter:
                      product?.stock === 0
                        ? "brightness(70%)"
                        : "brightness(100%)",
                    backgroundColor:
                      product?.stock < productQuantity ? "gray" : "",
                    cursor:
                      product?.stock < productQuantity || product?.stock === 0
                        ? "not-allowed"
                        : "",
                  }}
                  disabled={
                    product?.stock === 0 || product?.stock < productQuantity
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
                    handleAddToCart(user?.id, parseInt(id), productQuantity)
                  }
                  className="card__info__btn card__info__btn__cart"
                  type="primary"
                  style={{
                    pointerEvents: product?.stock === 0 ? "none" : "auto",
                    opacity: product?.stock === 0 ? "0.7" : "1",
                    filter:
                      product?.stock === 0
                        ? "brightness(70%)"
                        : "brightness(100%)",
                    backgroundColor:
                      product?.stock < productQuantity ? "gray" : "",
                    cursor:
                      product?.stock < productQuantity || product?.stock === 0
                        ? "not-allowed"
                        : "",
                  }}
                  disabled={
                    product?.stock === 0 || product?.stock < productQuantity
                      ? true
                      : false
                  }
                >
                  <div className="flex items-center justify-center">
                    {loadingAddedToCart ? (
                      <div>
                        <ThreeDots
                          visible={true}
                          height="25"
                          width="100"
                          color="#FFFFFF"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    ) : (
                      "Agregar al carrito"
                    )}
                  </div>
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
        <h1 className="card__info__desc__title text-2xl mt-5">Descripción</h1>
        <div className="card__info__desc mt-10">{product?.descripcion}</div>
      </div>
      <div className="card__info__questions mt-8 p-4 w-full h-full">
        <hr />
        <Questions vendedor_id={product?.vendedor_id} />
      </div>
      <div className="card__info__desc__comentary mt-8 p-4 w-full">
        <hr />
        <Comments />
      </div>
    </div>
  );
}

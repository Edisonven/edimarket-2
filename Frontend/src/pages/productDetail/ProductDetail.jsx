import "../productDetail/productDetail.css";
import { useContext, useEffect, useRef, useState, forwardRef } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OverlayScreen } from "../../components/overlayScreen/OverlayScreen";
import { Loader } from "../../components/loader/Loader";
import { IoIosClose } from "react-icons/io";
import { ProductCardDetail } from "../../components/productCard/ProductCardDetail";

const ModalIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoIosClose {...props} />
  </div>
));

export function ProductDetail() {
  const { loading, productAlert, setProductAlert, handleGetProduct, seller } =
    useContext(ProductContext);
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
        <div className="mx-auto">
          <Loader />
        </div>
      ) : (
        <div className="card__container">
          <OverlayScreen />
          <ProductCardDetail
            heartIconRef={heartIconRef}
            formatedSellerName={formatedSellerName}
            cartBtnRef={cartBtnRef}
            id={id}
            setProductAlert={setProductAlert}
          />
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

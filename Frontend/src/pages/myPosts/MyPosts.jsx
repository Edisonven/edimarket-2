import "../myPosts/myPosts.css";
import { useContext, useEffect, useState, useRef, forwardRef } from "react";
import { ProductCard } from "../../components/productCard/ProductCard";
import { ProductContext } from "../../context/ProductContext";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { TbEdit } from "react-icons/tb";
import { FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader/Loader";
import { UserContext } from "../../context/UserContext";
import postImg from "/imgs/aplication/posts.png";
import { ConfirmDelete } from "../../components/confirmDelete/ConfirmDelete";
import { IoIosClose } from "react-icons/io";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import config from "../../config/config";

const ModalIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoIosClose {...props} />
  </div>
));

export function MyPosts() {
  const {
    loading,
    setLoading,
    handleProductDetail,
    serverError,
    handleGetProducts,
  } = useContext(ProductContext);
  const { userToken, myProducts, getProductBySeller } = useContext(UserContext);
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [postDeleted, setPostDeleted] = useState({
    success: "",
    error: "",
  });

  const btnRef = useRef(null);
  const modalRef = useRef(null);
  const iconRef = useRef(null);

  const handleDeleteMyProducts = async (id) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/usuarios/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setPostDeleted((prevState) => ({
          ...prevState,
          error: "Error al eliminar producto.",
        }));
        setTimeout(() => {
          setPostDeleted((prevState) => ({
            ...prevState,
            error: "",
          }));
        }, 3000);
        throw new Error(errorData.message || "Error al eliminar producto");
      } else {
        setPostDeleted((prevState) => ({
          ...prevState,
          success: "Producto eliminado.",
        }));
        setTimeout(() => {
          setPostDeleted((prevState) => ({
            ...prevState,
            success: "",
          }));
        }, 3000);
      }
      const data = await response.json();
      getProductBySeller();
      handleGetProducts();
      setConfirmDeleteId(null);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const requestDeleteConfirmation = (id) => {
    setConfirmDeleteId(id);
  };

  const handleClickOutside = (e) => {
    if (
      iconRef.current &&
      btnRef.current &&
      modalRef.current &&
      !iconRef.current.contains(e.target) &&
      !btnRef.current.contains(e.target) &&
      !modalRef.current.contains(e.target)
    ) {
      setConfirmDeleteId("");
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <section className="myposts__container ">
      <h1 className="text-2xl font-semibold mb-5">Mis publicaciones</h1>
      {loading ? (
        <Loader />
      ) : serverError.myPostGetError ? (
        <p>{serverError.myPostGetError}</p>
      ) : (
        <div className="myposts__body flex flex-col gap-5 h-full bg-white shadow-sm p-3 rounded-md min-h-[500px]">
          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <ProductCard
                className="mypost__card__body border p-5 rounded-md flex flex-col gap-4"
                key={product?.productoId}
              >
                <div className="myposts__card__body flex items-start gap-5">
                  <img
                    onClick={() => handleProductDetail(product?.productoId)}
                    className="myposts__card__img border rounded-md"
                    src={product?.imagen}
                    alt=""
                  />
                  <div className="myposts__card__info flex flex-col gap-1 overflow-hidden">
                    <p className="myposts__card__paragraph text-md font-medium text-lg">
                      {product?.nombre}
                    </p>
                    <p className="myposts__card__info font-medium">
                      {product?.precio
                        ? Number(product?.precio).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                        : null}
                    </p>
                    <p className="text-sm text-gray-400 mt-3">
                      Publicado en Edimarket
                    </p>
                    <p className="text-sm text-gray-400 ">{product?.fecha}</p>
                  </div>
                </div>
                <div className="myposts__btn__container flex items-center gap-2">
                  <GeneralBtn
                    onClick={() => handleEditProduct(product?.productoId)}
                    className="myposts__btn"
                    type="secondary"
                  >
                    <TbEdit className="btn__edit" />
                  </GeneralBtn>
                  {confirmDeleteId === product?.productoId ? (
                    <ConfirmDelete
                      ref={modalRef}
                      className="confirm__delete__modal bg-gray-100 shadow-sm p-3 rounded-md flex flex-col items-stretch gap-4 border"
                    >
                      <ModalIcon
                        ref={iconRef}
                        onClick={() => {
                          setConfirmDeleteId("");
                        }}
                        className="close__icon"
                      />
                      <h2 className="text-center">Eliminar publicación</h2>
                      <hr />
                      <div className="flex items-start overflow-hidden gap-5">
                        <div>
                          <img
                            className="w-20 h-20 con object-cover rounded-md border"
                            src={product?.imagen}
                            alt=""
                          />
                        </div>
                        <div className="overflow-hidden w-40 flex flex-col gap-2 sm:w-48">
                          <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {product?.nombre}
                          </span>
                          <span className="font-medium">
                            {product?.precio
                              ? Number(product?.precio).toLocaleString(
                                  "es-CL",
                                  {
                                    style: "currency",
                                    currency: "CLP",
                                  }
                                )
                              : null}
                          </span>
                        </div>
                      </div>
                      <span className="text-center font-medium text-sm">
                        ¿Seguro que quieres eliminar esta publicación?
                      </span>
                      <hr />
                      <div className="flex items-center justify-evenly">
                        <GeneralBtn
                          onClick={() => {
                            setConfirmDeleteId("");
                          }}
                          type="primary"
                          className="confirm__delete__btn"
                        >
                          Cancelar
                        </GeneralBtn>
                        <GeneralBtn
                          onClick={() =>
                            handleDeleteMyProducts(confirmDeleteId)
                          }
                          type="primary"
                          className="confirm__delete__btn"
                        >
                          Eliminar
                        </GeneralBtn>
                      </div>
                    </ConfirmDelete>
                  ) : (
                    ""
                  )}
                  <GeneralBtn
                    ref={
                      confirmDeleteId === product?.productoId ? btnRef : null
                    }
                    onClick={() =>
                      requestDeleteConfirmation(product?.productoId)
                    }
                    className="myposts__btn"
                    type="secondary"
                  >
                    <FaTrashCan className="btn__trash" />
                  </GeneralBtn>
                </div>
              </ProductCard>
            ))
          ) : (
            <div className="grid items-center justify-items-center gap-7">
              <span className="text-center text-2xl font-semibold">
                Aún no has publicado.
              </span>
              <p className=" text-center">
                Cuando vendas, tus publicaciones aparecerán aquí.
              </p>
              <img className="post__img" src={postImg} alt="" />
            </div>
          )}
        </div>
      )}
      {postDeleted.success && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-slate-700">
            {postDeleted.success}
          </p>
        </CartAlert>
      )}
      {postDeleted.error && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
            {postDeleted.error}
          </p>
        </CartAlert>
      )}
    </section>
  );
}

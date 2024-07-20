import "../userCards/userCards.css";
import { Link, useNavigate } from "react-router-dom";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { useContext, useEffect, useRef, useState, forwardRef } from "react";
import { UserContext } from "../../context/UserContext";
import { ProductContext } from "../../context/ProductContext";
import { Loader } from "../../components/loader/Loader";
import { ConfirmDelete } from "../../components/confirmDelete/ConfirmDelete";
import { IoIosClose } from "react-icons/io";
import { CartAlert } from "../../components/cartAlert/CartAlert";

const ModalIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoIosClose {...props} />
  </div>
));

export function UserCards() {
  const navigate = useNavigate();

  const handleNavigateToAddCard = () => {
    navigate("/add-credit-cards");
  };
  const { userToken, user, userCreditCards, handleUserCards } =
    useContext(UserContext);
  const { loading, setLoading } = useContext(ProductContext);
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const iconRef = useRef(null);
  const modalRef = useRef(null);
  const btnRef = useRef(null);
  const [addCardSuccess, setAddCardSuccess] = useState({
    success: "",
    error: "",
  });

  const handleOpenModal = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteCards = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend-mu-three-82.vercel.app/usuarios/usuario/metodosPago/${id}`,
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
        throw new Error(errorData.message || "Error al eliminar tarjeta");
      } else {
        setAddCardSuccess((prevData) => ({
          ...prevData,
          success: "Tarjeta eliminada",
        }));
        setTimeout(() => {
          setAddCardSuccess((prevData) => ({
            ...prevData,
            success: "",
          }));
        }, 3000);
      }

      const data = await response.json();
      setConfirmDeleteId("");
      handleUserCards();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
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
    <section className="usercards__container ">
      <h1 className="text-2xl font-semibold mb-5">Mis tarjetas</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="usercards__body bg-white shadow-sm rounded-md p-3 ">
          {userCreditCards.length ? (
            <div className="credit-card__body">
              {userCreditCards.map((card) => (
                <div
                  key={card?.numero_tarjeta}
                  className="usercards__card__body flex w-full border rounded-md p-3 max-w-[800px] mx-auto "
                >
                  <div className="flex items-center justify-start gap-5 w-full">
                    <div className="credit-card-container">
                      <img
                        className="credit-card__img"
                        src={`/imgs/aplication/${
                          card?.tipo_tarjeta === "visa"
                            ? "visa.png"
                            : "mastercard.png"
                        }`}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-lg">
                        {card?.tipo_tarjeta.charAt(0).toUpperCase() +
                          card?.tipo_tarjeta.slice(1)}
                      </span>
                      <div>
                        <span className="text-sm">Terminada en </span>
                        <span className="font-semibold">
                          {card?.numero_tarjeta.slice(11, 15)}
                        </span>
                      </div>

                      <span className="text-sm">
                        Vencimiento{" "}
                        <span className="font-semibold">
                          {card?.fecha_expiracion.slice(0, 2) +
                            "/" +
                            card?.fecha_expiracion.slice(2)}
                        </span>
                      </span>
                    </div>
                    {confirmDeleteId === card?.id ? (
                      <ConfirmDelete
                        ref={modalRef}
                        className="confirm__delete__modal__card bg-gray-100 shadow-sm p-3 rounded-md flex flex-col items-stretch gap-4 border"
                      >
                        <ModalIcon
                          ref={iconRef}
                          onClick={() => {
                            setConfirmDeleteId("");
                          }}
                          className="close__icon"
                        />
                        <h2 className="text-center">Eliminar medio de pago</h2>
                        <hr />
                        <span className="text-center font-medium text-sm">
                          ¿Seguro que quieres eliminar el medio de pago?
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
                            onClick={() => handleDeleteCards(confirmDeleteId)}
                            type="primary"
                            className="confirm__delete__btn"
                          >
                            Eliminar
                          </GeneralBtn>
                        </div>
                      </ConfirmDelete>
                    ) : null}
                  </div>

                  <button
                    ref={confirmDeleteId === card?.id ? btnRef : null}
                    onClick={() => handleOpenModal(card?.id)}
                    className="self-end font-semibold hover:text-teal-500 text-sm sm:text-normal"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center sm:my-5">
              <p className="font-semibold">Agrega una tarjeta de crédito</p>
              <GeneralBtn
                onClick={handleNavigateToAddCard}
                type="secondary"
                className="credit-card-btn"
              >
                Añadir
              </GeneralBtn>
            </div>
          )}
          {userCreditCards.length > 0 ? (
            <GeneralBtn
              onClick={handleNavigateToAddCard}
              type="secondary"
              className="credit-card-btn_2"
            >
              Añadir
            </GeneralBtn>
          ) : (
            ""
          )}
        </div>
      )}
      {addCardSuccess.success && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-slate-700">
            {addCardSuccess.success}
          </p>
        </CartAlert>
      )}
      {addCardSuccess.error && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
            {addCardSuccess.error}
          </p>
        </CartAlert>
      )}
    </section>
  );
}

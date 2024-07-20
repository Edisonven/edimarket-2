import { useContext, useEffect, useState } from "react";
import "../addUserCards/addUserCards.css";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { ProductContext } from "../../context/ProductContext";

export function AddUserCards() {
  const {
    handleChange,
    userData,
    onlyNumbersRegex,
    inputFormError,
    setInputFormError,
    inputRefs,
    userToken,
    user,
    handleUserCards,
  } = useContext(UserContext);
  const { setLoading } = useContext(ProductContext);
  const navigate = useNavigate();

  const [addCardSuccess, setAddCardSuccess] = useState({
    success: "",
    error: "",
  });

  const addNewPaymentMehotd = async (
    usuario_id,
    tipo_tarjeta,
    numero_tarjeta,
    nombre_titular,
    fecha_expiracion,
    codigo_seguridad
  ) => {
    try {
      const response = await fetch(
        "https://backend-mu-three-82.vercel.app/usuarios/metodosPago",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            usuario_id,
            tipo_tarjeta,
            numero_tarjeta,
            nombre_titular,
            fecha_expiracion,
            codigo_seguridad,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar metodo de pago");
      }

      const data = await response.json();
      handleUserCards();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddCreditCard = async (e) => {
    e.preventDefault();

    if (userData.tipo === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorTipo: "Selecciona el tipo de tarjeta.",
      }));
    } else if (userData.numeroTarjeta.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNumeroTarjeta: "Ingresa el número de tarjeta (Ficticio).",
      }));
    } else if (!onlyNumbersRegex.test(userData.numeroTarjeta.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNumeroTarjeta: "Ingresa solo números.",
      }));
    } else if (userData.numeroTarjeta.trim().length < 16) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNumeroTarjeta: "Número incompleto. (16 caractéres)",
      }));
    } else if (userData.nombreTitular.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNombreTitular: "Ingresa el nombre del titular.",
      }));
    } else if (onlyNumbersRegex.test(userData.nombreTitular.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNombreTitular: "No puedes ingresar números.",
      }));
    } else if (userData.expiracion.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorExpiracion: "Ingresa fecha de expiración.",
      }));
    } else if (userData.expiracion.trim().length < 4) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorExpiracion: "Fecha incompleta.",
      }));
    } else if (!onlyNumbersRegex.test(userData.expiracion.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorExpiracion: "Ingresa solo números.",
      }));
    } else if (userData.cvv.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCvv: "Ingresa el CVV.",
      }));
    } else if (!onlyNumbersRegex.test(userData.cvv.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCvv: "Ingresa solo números.",
      }));
    } else if (userData.cvv.trim().length < 3) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCvv: "CVV incompleto.",
      }));
    } else {
      try {
        const res = await addNewPaymentMehotd(
          user.id,
          userData.tipo,
          userData.numeroTarjeta,
          userData.nombreTitular,
          userData.expiracion,
          userData.cvv
        );
        setAddCardSuccess((prevState) => ({
          ...prevState,
          success: "¡Medio de pago añadido!",
        }));
        setTimeout(() => {
          navigate("/my-credit-cards");
        }, 1500);
      } catch (error) {
        console.error("Error:", error.message);
        setAddCardSuccess((prevState) => ({
          ...prevState,
          error: "No pudimos agregar la tarjeta.",
        }));
        setTimeout(() => {
          setAddCardSuccess((prevState) => ({
            ...prevState,
            error: "",
          }));
        }, 3000);
      }
    }
  };

  return (
    <section className="addusercards__container">
      <h1 className="text-2xl font-semibold mb-5">Añade una tarjeta</h1>
      <div className="addusercards__body bg-white shadow-sm rounded-sm p-3">
        <div className="flex items center justify-center">
          <img
            className="creditcards "
            src={`/imgs/aplication/${
              userData.tipo === "visa"
                ? "visaCard.png"
                : userData.tipo === "mastercard"
                ? "mastercardCard.png"
                : "card.png"
            }`}
            alt=""
          />
        </div>
        <form
          onSubmit={handleAddCreditCard}
          className="addusercards__form flex flex-col justify-between w-full"
        >
          <select
            ref={inputRefs.tipo}
            className={`addusercards__input ${
              inputFormError.errorTipo
                ? "focus: outline-2 outline outline-red-600"
                : "focus: outline-2 outline-green-300"
            }`}
            placeholder="Tipo de tarjeta"
            type="text"
            name="tipo"
            value={userData.tipo}
            onChange={handleChange}
          >
            <option value="">Selecciona</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
          </select>
          {inputFormError.errorTipo ? (
            <p className="text-red-600 font-semibold text-sm">
              {inputFormError.errorTipo}
            </p>
          ) : (
            ""
          )}

          <input
            ref={inputRefs.numeroTarjeta}
            className={`addusercards__input ${
              inputFormError.numeroTarjeta
                ? "focus: outline-2 outline outline-red-600"
                : "focus: outline-2 outline-green-300"
            }`}
            placeholder="Número de tarjeta"
            type="text"
            maxLength="16"
            name="numeroTarjeta"
            value={userData.numeroTarjeta}
            onChange={handleChange}
          />
          {inputFormError.errorNumeroTarjeta ? (
            <p className="text-red-600 font-semibold text-sm">
              {inputFormError.errorNumeroTarjeta}
            </p>
          ) : (
            ""
          )}
          <input
            ref={inputRefs.nombreTitular}
            className={`addusercards__input ${
              inputFormError.errorNombreTitular
                ? "focus: outline-2 outline outline-red-600"
                : "focus: outline-2 outline-green-300"
            }`}
            type="text"
            name="nombreTitular"
            placeholder="Nombre del titular"
            value={userData.nombreTitular}
            onChange={handleChange}
          />
          {inputFormError.errorNombreTitular ? (
            <p className="text-red-600 font-semibold text-sm">
              {inputFormError.errorNombreTitular}
            </p>
          ) : (
            ""
          )}
          <div className="flex items-start gap-5 ">
            <div className="flex flex-col w-full">
              <input
                ref={inputRefs.expiracion}
                className={`addusercards__input ${
                  inputFormError.errorExpiracion
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
                maxLength="4"
                name="expiracion"
                placeholder="Fecha de expiración"
                value={userData.expiracion}
                onChange={handleChange}
              />
              {inputFormError.errorExpiracion ? (
                <p className="text-red-600 font-semibold text-sm">
                  {inputFormError.errorExpiracion}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="flex flex-col w-full">
              <input
                ref={inputRefs.cvv}
                className={`addusercards__input ${
                  inputFormError.errorCvv
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
                maxLength="3"
                name="cvv"
                placeholder="CVV"
                value={userData.cvv}
                onChange={handleChange}
              />
              {inputFormError.errorCvv ? (
                <p className="text-red-600 font-semibold text-sm">
                  {inputFormError.errorCvv}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <GeneralBtn className="addusercards__btn" type="secondary">
            Guardar
          </GeneralBtn>
        </form>
        {addCardSuccess.success && (
          <CartAlert>
            <p className="card__perfil__alert shadow-md rounded-md bg-green-600">
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
      </div>
    </section>
  );
}

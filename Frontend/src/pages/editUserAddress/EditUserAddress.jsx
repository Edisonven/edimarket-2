import { useContext, useEffect } from "react";
import "../editUserAddress/editUserAddress.css";
import { UserContext } from "../../context/UserContext";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import config from "../../config/config";

export function EditUserAddress() {
  const {
    setInputFormError,
    userData,
    setUserData,
    handleChange,
    inputRefs,
    onlyNumbersRegex,
    inputFormError,
    AddAddressSuccess,
    setAddAddressSuccess,
    userToken,
    user,
    userAddress,
    handleUserAddress,
    selectedAddressId,
  } = useContext(UserContext);
  const { setLoading } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleEditUserAddress = async (
    direccion,
    numero_casa,
    ciudad,
    comuna,
    region,
    codigo_postal,
    idUsuario
  ) => {
    try {
      const response = await fetch(`${config.backendUrl}/usuarios/domicilio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          direccion,
          numero_casa,
          ciudad,
          comuna,
          region,
          codigo_postal,
          idUsuario,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al modificar domicilio");
      }

      const data = await response.json();
      handleUserAddress();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (userData.direccion.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorDireccion: "Ingresa tu dirección.",
      }));
    } else if (userData.region === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorRegion: "Selecciona la región.",
      }));
    } else if (userData.comuna === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorComuna: "Selecciona la comuna.",
      }));
    } else if (userData.codigoPostal.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCodigoPostal: "Ingresa el código postal.",
      }));
    } else if (!onlyNumbersRegex.test(userData.codigoPostal.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCodigoPostal: "Ingresa solo números.",
      }));
    } else if (userData.numero.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNumero: "Ingresa el número de la dirección.",
      }));
    } else if (!onlyNumbersRegex.test(userData.numero.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNumero: "Ingresa solo números.",
      }));
    } else {
      try {
        const res = await handleEditUserAddress(
          userData.direccion,
          userData.numero,
          userData.region,
          userData.comuna,
          userData.region,
          userData.codigoPostal,
          user.id
        );
        setAddAddressSuccess((prevState) => ({
          ...prevState,
          success: "Domicilio modificado",
        }));
        setTimeout(() => {
          navigate("/user-address");
        }, 1500);
      } catch (error) {
        console.error("Error:", error.message);
        setAddAddressSuccess((prevState) => ({
          ...prevState,
          error: "No pudimos modificar tu domicilio.",
        }));
      }
      setTimeout(() => {
        setAddAddressSuccess((prevState) => ({
          ...prevState,
          error: "",
        }));
      }, 3000);
    }
  };

  useEffect(() => {
    const newData = userAddress.find(
      (address) => address.id === selectedAddressId
    );
    setUserData((prevData) => ({
      ...prevData,
      direccion: newData?.direccion,
      region: newData?.region,
      comuna: newData?.comuna,
      codigoPostal: newData?.codigo_postal,
      numero: newData?.numero_casa,
    }));

    inputRefs.direccion.current.focus();
  }, []);

  return (
    <section className="edituseraddress__container ">
      <h1 className="mb-5">Editar dirección</h1>
      <div className="edituseraddress__body bg-white shadow-sm rounded-md flex p-3">
        <form
          onSubmit={handleAddressSubmit}
          className="edituseraddress__form border rounded-md shadow-sm my-8 m-auto"
        >
          <div className="nombre">
            <label htmlFor="">Dirección</label>
            <input
              onChange={handleChange}
              value={userData.direccion}
              className={`address__input ${
                inputFormError.errorDireccion
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              type="text"
              name="direccion"
              ref={inputRefs.direccion}
            />
            {inputFormError.errorDireccion ? (
              <p className="text-red-600 font-semibold text-sm ml-7">
                {inputFormError.errorDireccion}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="region w-full">
              <label htmlFor="">Region</label>
              <select
                ref={inputRefs.region}
                onChange={handleChange}
                value={userData.region}
                className={`address__input ${
                  inputFormError.errorRegion
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                name="region"
                id=""
              >
                <option value="">Selecciona</option>
                <option value="metropolitana">Metropolitana</option>
              </select>
              {inputFormError.errorRegion ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorRegion}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="comuna w-full">
              <label htmlFor="">Comuna</label>
              <select
                ref={inputRefs.comuna}
                onChange={handleChange}
                value={userData.comuna}
                className={`address__input ${
                  inputFormError.errorComuna
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                name="comuna"
                id=""
              >
                <option value="">Selecciona</option>
                <option value="san-miguel">San miguel</option>
                <option value="san-joaquin">San Joaquin</option>
                <option value="ñuñoa">Ñuñoa</option>
                <option value="maipu">Maipu</option>
                <option value="santiago-centro">Santiago centro</option>
                <option value="renca">Renca</option>
                <option value="pudahuel">Pudahuel</option>
                <option value="puente-alto">Puente alto</option>
                <option value="independencia">Independencia</option>
              </select>
              {inputFormError.errorComuna ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorComuna}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="region">
              <label htmlFor="">Código postal</label>
              <input
                ref={inputRefs.codigoPostal}
                onChange={handleChange}
                value={userData.codigoPostal}
                className={`address__input ${
                  inputFormError.errorCodigoPostal
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
                name="codigoPostal"
              />
              {inputFormError.errorCodigoPostal ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorCodigoPostal}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="comuna">
              <label htmlFor="">Número</label>
              <input
                ref={inputRefs.numero}
                onChange={handleChange}
                value={userData.numero}
                className={`address__input ${
                  inputFormError.errorNumero
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
                name="numero"
              />
              {inputFormError.errorNumero ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorNumero}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <GeneralBtn
            type="secondary"
            className="adress__btn self-end justify-self-end"
          >
            Guardar
          </GeneralBtn>
        </form>
        {AddAddressSuccess.success && (
          <CartAlert>
            <p className="card__perfil__alert shadow-md rounded-md bg-green-600">
              {AddAddressSuccess.success}
            </p>
          </CartAlert>
        )}
        {AddAddressSuccess.error && (
          <CartAlert>
            <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
              {AddAddressSuccess.error}
            </p>
          </CartAlert>
        )}
      </div>
    </section>
  );
}

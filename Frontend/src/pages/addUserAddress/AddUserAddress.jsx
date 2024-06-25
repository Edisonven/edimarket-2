import { useContext, useState } from "react";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import "../addUserAddress/addUserAddress.css";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export function AddUserAdress() {
  const {
    setInputFormError,
    userData,
    handleChange,
    inputRefs,
    onlyNumbersRegex,
    inputFormError,
    user,
    userToken,
    AddAddressSuccess,
    setAddAddressSuccess,
    setLoading,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const handleAddAddress = async (
    idUsuario,
    direccion,
    numero_casa,
    ciudad,
    comuna,
    region,
    codigo_postal
  ) => {
    try {
      const response = await fetch("http://localhost:3000/usuarios/domicilio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          idUsuario,
          direccion,
          numero_casa,
          ciudad,
          comuna,
          region,
          codigo_postal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar domicilio");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
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
        const res = await handleAddAddress(
          user.id,
          userData.direccion,
          userData.numero,
          userData.region,
          userData.comuna,
          userData.region,
          userData.codigoPostal
        );

        setAddAddressSuccess((prevState) => ({
          ...prevState,
          success: "¡Domicilio añadido!",
        }));

        setTimeout(() => {
          navigate("/user-address");
        }, 1500);
      } catch (error) {
        console.error("Error:", error.message);
        setAddAddressSuccess((prevState) => ({
          ...prevState,
          error: "No pudimos agregar tu domicilio.",
        }));
      }
    }
  };

  return (
    <section className="adduseraddress__container bg-white shadow-sm rounded-sm">
      <h1 className="mb-5">Añadir dirección</h1>
      <div className="edituseraddress__body">
        <form
          onSubmit={handleAddressSubmit}
          className="edituseraddress__form border rounded-md shadow-sm"
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
          {AddAddressSuccess.success ? (
            <p className="font-bold text-green-600">
              {AddAddressSuccess.success}
            </p>
          ) : (
            <p className="font-bold text-red-600">{AddAddressSuccess.error}</p>
          )}

          <GeneralBtn
            type="secondary"
            className="adress__btn self-end justify-self-end"
          >
            Guardar
          </GeneralBtn>
        </form>
      </div>
    </section>
  );
}

import "./singUp.css";
import { NavLink, useNavigate } from "react-router-dom";
import { PerfilBtn } from "../../components/perfilBtn/PerfilBtn";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { HiEye } from "react-icons/hi";
import { HiEyeOff } from "react-icons/hi";
import google from "/imgs/aplication/google.png";
import config from "../../config/config";

export function SingUp() {
  const {
    emailRegex,
    userData,
    handleChange,
    inputRefs,
    inputFormError,
    setInputFormError,
    setUserData,
    initialUserData,
    onlyNumbersRegex,
  } = useContext(UserContext);
  const [singUpSuccess, setSingUpSuccess] = useState({
    success: "",
    error: "",
  });

  const navigate = useNavigate();

  const [signUpIcon, setSignUpIcon] = useState(false);

  const handleSignUpIcon = () => {
    setSignUpIcon(!signUpIcon);
  };

  const registerNewUser = async (nombre, email, contraseña) => {
    const response = await fetch(`${config.backendUrl}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, contraseña }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro");
    }
    const data = await response.json();
    return data;
  };

  const handleSingupSubmit = async (e) => {
    e.preventDefault();

    // Resetear todos los errores
    setInputFormError({
      errorNombre: "",
      errorEmail: "",
      errorContraseña: "",
      errorConfirmContraseña: "",
    });

    setSingUpSuccess({
      success: "",
      error: "",
    });

    // Validar cada campo uno por uno
    if (userData.nombre.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNombre: "Ingresa tu nombre.",
      }));
    } else if (userData.nombre.trim().length < 10) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNombre: "Ingresa tu nombre completo.",
      }));
    } else if (onlyNumbersRegex.test(userData.nombre)) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorNombre: "No puedes ingresar números.",
      }));
    } else if (userData.email.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorEmail: "Ingresa tu correo electrónico.",
      }));
    } else if (!emailRegex.test(userData.email.trim())) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorEmail: "Ingresa un correo electrónico válido.",
      }));
    } else if (userData.contraseña.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorContraseña: "Ingresa tu contraseña.",
      }));
    } else if (userData.contraseña.length < 8) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorContraseña: "Ingresa mínimo 8 caracteres.",
      }));
    } else if (userData.confirmContraseña.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorConfirmContraseña: "Confirma tu contraseña.",
      }));
    } else if (
      userData.contraseña.trim() !== userData.confirmContraseña.trim()
    ) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorConfirmContraseña: "Las contraseñas no coinciden.",
      }));
    } else {
      try {
        const res = await registerNewUser(
          userData.nombre,
          userData.email,
          userData.contraseña
        );
        setSingUpSuccess((prevMessage) => ({
          ...prevMessage,
          success: "¡Te has registrado con éxito!",
        }));
        setUserData(initialUserData);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Error:", error.message);
        setSingUpSuccess((prevMessage) => ({
          ...prevMessage,
          error: `El email ya está registrado. ${userData.email}`,
        }));
        setUserData(initialUserData);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/auth/google`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al autenticar con google");
      }

      const data = response.json();
      return data;
    } catch (error) {
      console.error(error.message || "No pudimos auntenticar tu cuenta");
    }
  };

  return (
    <section className="register__container">
      <div className="register__form__container shadow-md rounded-md bg-white">
        <form onSubmit={handleSingupSubmit} className="register__form">
          <div className="register__form__title__container">
            <h1 className="register__form__title text-center text-2xl font-medium">
              Bienvenid@s a EdiMarket
            </h1>
            <p className="register__form__paragraph text-center text-sm mt-2">
              Por favor ingresa tus datos para crear tu cuenta
            </p>
          </div>
          <div className="register__form__input__container">
            <div className="register__input__container">
              <input
                ref={inputRefs.nombre}
                name="nombre"
                placeholder=" "
                onChange={handleChange}
                value={userData.nombre}
                className={`register__form__input ${
                  inputFormError.errorNombre
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
              />
              {inputFormError.errorNombre ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorNombre}
                </p>
              ) : (
                ""
              )}
              <p className="register__form__input__paragraph text-sm">
                Nombre completo
              </p>
            </div>
            <div className="register__input__container">
              <input
                ref={inputRefs.email}
                placeholder=" "
                name="email"
                onChange={handleChange}
                value={userData.email}
                className={`register__form__input ${
                  inputFormError.errorEmail
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type="text"
              />
              {inputFormError.errorEmail ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorEmail}
                </p>
              ) : (
                ""
              )}
              <p className="register__form__input__paragraph text-sm">Email</p>
            </div>
            <div className="register__input__container">
              <input
                ref={inputRefs.contraseña}
                placeholder=" "
                name="contraseña"
                onChange={handleChange}
                value={userData.contraseña}
                className={`register__form__input ${
                  inputFormError.errorContraseña
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type={signUpIcon ? "text" : "password"}
              />
              {inputFormError.errorContraseña ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorContraseña}
                </p>
              ) : (
                ""
              )}
              <p className="register__form__input__paragraph text-sm">
                Contraseña
              </p>
              {signUpIcon ? (
                <HiEye
                  onClick={handleSignUpIcon}
                  className="input__eye__icon"
                />
              ) : (
                <HiEyeOff
                  onClick={handleSignUpIcon}
                  className="input__eye__icon"
                />
              )}
            </div>
            <div className="register__input__container">
              <input
                placeholder=" "
                ref={inputRefs.confirmContraseña}
                name="confirmContraseña"
                onChange={handleChange}
                value={userData.confirmContraseña}
                className={`register__form__input ${
                  inputFormError.errorConfirmContraseña
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type={signUpIcon ? "text" : "password"}
              />
              {inputFormError.errorConfirmContraseña ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorConfirmContraseña}
                </p>
              ) : (
                ""
              )}
              <p className="register__form__input__paragraph text-sm">
                Confirmar Contraseña
              </p>
              {signUpIcon ? (
                <HiEye
                  onClick={handleSignUpIcon}
                  className="input__eye__icon"
                />
              ) : (
                <HiEyeOff
                  onClick={handleSignUpIcon}
                  className="input__eye__icon"
                />
              )}
            </div>
          </div>
          {singUpSuccess.success ? (
            <p className="font-bold text-green-600">{singUpSuccess.success}</p>
          ) : (
            <p className="font-bold text-red-600">{singUpSuccess.error}</p>
          )}
          <PerfilBtn
            type="submit"
            className="register__form__btn bg-teal-300 w-6/12 h-11 rounded-3xl font-semibold text-center shadow-md"
          >
            CREAR CUENTA
          </PerfilBtn>
          <div className="register__form__singin">
            <p className="register__form__paragraph text-sm">
              ¿Ya tienes cuenta?
            </p>
            <NavLink
              to="/sign-in"
              className="register__form__link text-sm text-teal-500 font-bold"
            >
              Iniciar Sesión
            </NavLink>
          </div>
        </form>
        {/*  <hr className="w-full my-4" />
        <h4 className="text-center mt-3 font-medium text-md text-gray-800">
          También puedes crear tu cuenta con
        </h4>
        <div className="flex justify-center">
          <PerfilBtn
            onClick={handleGoogleAuth}
            type="submit"
            className=" bg-gray-100 h-[40px] rounded-3xl font-semibold text-center shadow-md flex items-center gap-2 hover:brightness-90 duration-[0.3s] px-3 my-3"
          >
            <img className="w-[20px]" src={google} alt="" />
            Ingresar con google
          </PerfilBtn>
        </div> */}
      </div>
    </section>
  );
}

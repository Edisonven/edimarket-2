import "./singIn.css";
import { NavLink, useNavigate } from "react-router-dom";
import { PerfilBtn } from "../../components/perfilBtn/PerfilBtn";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { HiEye } from "react-icons/hi";
import { HiEyeOff } from "react-icons/hi";
import config from "../../config/config";

export function SingIn() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [singInSuccess, setSingInSuccess] = useState({
    success: "",
    error: "",
  });

  const {
    userData,
    inputRefs,
    handleChange,
    inputFormError,
    setInputFormError,
    setUser,
    setUserToken,
    setUserData,
    initialUserData,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const [signInIcon, setSignInIcon] = useState(false);

  const handleSignInIcon = () => {
    setSignInIcon(!signInIcon);
  };

  const LoginWithCredentials = async (email, contraseña) => {
    const response = await fetch(`${config.backendUrl}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contraseña }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el login");
    }

    const data = await response.json();
    setUserToken(data.token || null);
    setUser(data.user);
    return data;
  };

  const handleSingInSubmit = async (e) => {
    e.preventDefault();

    setInputFormError({
      errorEmail: "",
      errorContraseña: "",
    });

    if (userData.email.trim() === "") {
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
    } else {
      try {
        const res = await LoginWithCredentials(
          userData.email,
          userData.contraseña
        );
        setSingInSuccess((prevMessage) => ({
          ...prevMessage,
          success: "¡Bienvenido!",
        }));
        setUserData(initialUserData);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Error:", error.message);
        setSingInSuccess((prevMessage) => ({
          ...prevMessage,
          error: "Correo o contraseña inválidos.",
        }));
        setUserData(initialUserData);
      }
    }
  };

  return (
    <section className="login__container ">
      <div className="login__form__container shadow-md rounded-md bg-white">
        <form onSubmit={handleSingInSubmit} className="login__form">
          <div className="login__form__title__container">
            <h1 className="login__form__title text-center text-2xl font-medium">
              Bienvenid@s a EdiMarket
            </h1>
            <p className="login__form__paragraph text-center text-sm my-2">
              Por favor ingresa tus datos para entrar
            </p>
          </div>
          <div className="login__form__input__container">
            <div className="login__input__container">
              <input
                ref={inputRefs.email}
                name="email"
                onChange={handleChange}
                value={userData.email}
                placeholder=" "
                className={`login__form__input  ${
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
              <p className="login__form__input__paragraph text-sm">Email</p>
            </div>
            <div className="login__input__container">
              <input
                ref={inputRefs.contraseña}
                name="contraseña"
                placeholder=" "
                onChange={handleChange}
                value={userData.contraseña}
                className={`login__form__input  ${
                  inputFormError.errorContraseña
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                type={signInIcon ? "text" : "password"}
              />
              {inputFormError.errorContraseña ? (
                <p className="text-red-600 font-semibold text-sm ml-7">
                  {inputFormError.errorContraseña}
                </p>
              ) : (
                ""
              )}
              <p className="login__form__input__paragraph text-sm">
                Contraseña
              </p>
              {signInIcon ? (
                <HiEye
                  onClick={handleSignInIcon}
                  className="input__eye__icon"
                />
              ) : (
                <HiEyeOff
                  onClick={handleSignInIcon}
                  className="input__eye__icon"
                />
              )}
            </div>
          </div>
          {singInSuccess.success ? (
            <p className="font-bold text-green-600">{singInSuccess.success}</p>
          ) : (
            <p className="font-bold text-red-600">{singInSuccess.error}</p>
          )}

          <PerfilBtn className="login__form__btn bg-teal-300 w-6/12 h-11 rounded-3xl font-semibold text-center">
            INICIAR SESIÓN
          </PerfilBtn>
          <div className="login__form__singin">
            <p className="login__form__paragraph text-sm">¿No tienes cuenta?</p>
            <NavLink
              to="/sign-up"
              className="login__form__link text-sm text-teal-500 font-bold"
            >
              Crear una cuenta
            </NavLink>
          </div>
        </form>
      </div>
    </section>
  );
}

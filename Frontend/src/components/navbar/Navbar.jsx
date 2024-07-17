import "../navbar/navbar.css";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState, useRef, forwardRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavBurger } from "../navBurger/NavBurger";
import { Perfil } from "../perfil/Perfil.jsx";
import { SearchBar } from "../searchBar/SearchBar.jsx";
import { ProductContext } from "../../context/ProductContext.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import { CartContext } from "../../context/CarritoContext.jsx";
import { Categories } from "../categories/Categories.jsx";
import { BurgerCategories } from "../burgerCategories/BurgerCategories.jsx";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { GeneralBtn } from "../generalBtn/GeneralBtn.jsx";
import { OverlayScreen } from "../overlayScreen/OverlayScreen.jsx";
import navbarLogo from "/imgs/aplication/navLogo2.1.png";
import { CiSquareQuestion } from "react-icons/ci";
import { CiStar } from "react-icons/ci";

// Crear un componente envolvente para manejar la referencia
const UserIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <FaUserCircle {...props} />
  </div>
));
const SearchIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <FiSearch {...props} />
  </div>
));

export function Navbar({ navbarRef }) {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [openPerfilMenu, setOpenPerfilMenu] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const navigate = useNavigate();
  const perfilButtonRef = useRef(null);
  const perfilMenuRef = useRef(null);
  const menuRef = useRef(null);
  const menuContainerRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchBarIconRef = useRef(null);
  const { setOpenCategories, setPage } = useContext(ProductContext);
  const categoriesBtnRef = useRef(null);
  const { userToken, logout, user } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    if (navigate) {
      setOpenPerfilMenu(false);
      setOpenSearchBar(false);
    }
  }, [navigate]);

  const handleOpenPerfilMenu = () => {
    setOpenPerfilMenu(!openPerfilMenu);
    if (isMobile) {
      if (openSearchBar) {
        setOpenSearchBar(false);
      } else if (clicked) {
        setClicked(false);
      }
    }
  };

  const handleOpenSearchBar = () => {
    setOpenSearchBar(!openSearchBar);
    if (openPerfilMenu) {
      setOpenPerfilMenu(false);
    } else if (clicked) {
      setClicked(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
    setPage(1);
  };

  const handleClickOutside = (event) => {
    if (
      categoriesBtnRef.current &&
      !categoriesBtnRef.current.contains(event.target)
    ) {
      setOpenCategories(false);
    }

    if (
      menuRef.current &&
      menuContainerRef.current &&
      !menuRef.current.contains(event.target) &&
      !menuContainerRef.current.contains(event.target)
    ) {
      setClicked(false);
    }

    if (
      searchBarRef.current &&
      searchBarIconRef.current &&
      !searchBarRef.current.contains(event.target) &&
      !searchBarIconRef.current.contains(event.target)
    ) {
      setOpenSearchBar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Detener la propagación del evento
    setOpenCategories((prev) => !prev);
  };

  useEffect(() => {
    const navbar = navbarRef.current;

    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          navbar.classList.add("navbarScroll");
        } else {
          navbar.classList.remove("navbarScroll");
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (!userToken) {
      setOpenPerfilMenu(false);
    }
  }, [userToken]);

  return (
    <nav ref={navbarRef} className="navbar__container shadow select-none">
      <OverlayScreen clicked={clicked} />
      <div className="navbar__logo__container">
        <div className="navbar__logo__section">
          <img
            onClick={handleBackToHome}
            className="navbar__logo__img"
            src={navbarLogo}
            alt=""
          />
          <div className="navbar__search__container">
            <div className="navbar__search__input__container">
              <SearchBar ref={searchBarRef} openSearchBar={openSearchBar} />
            </div>
            <SearchIcon
              ref={searchBarIconRef}
              onClick={handleOpenSearchBar}
              className="navbar__search__icon"
            />
          </div>
        </div>

        <div className="navbar__user__container">
          <div className="navbar__user__icons__container">
            <UserIcon
              ref={perfilButtonRef}
              onClick={handleOpenPerfilMenu}
              className="navbar__user__icon "
            />
            <div className="navbar__icons__menu__container">
              <NavBurger
                clicked={clicked}
                setOpenPerfilMenu={setOpenPerfilMenu}
                setOpenSearchBar={setOpenSearchBar}
                isMobile={isMobile}
                setClicked={setClicked}
                setIsMobile={setIsMobile}
                menuRef={menuRef}
              />
              <div
                ref={menuContainerRef}
                className={`navbar__menu__links  ${
                  clicked ? "navActiveMenu" : ""
                }`}
              >
                {userToken ? (
                  <div className="navbar__perfil__desktop w-full">
                    <h1 className="mb-3 font-medium text-center">
                      ¡Bienvenido!
                    </h1>
                    <hr className="w-full" />
                    <div className="flex flex-col gap-1 my-3">
                      <span className="font-semibold">{user.nombre}</span>
                      <span className="text-xs text-gray-600">
                        {user.email}
                      </span>
                    </div>
                    <hr className="w-full mb-3" />
                    <Link
                      to="miperfil"
                      className="navbar__menu__link navbar__menu__link__mobile"
                    >
                      <CiUser className="miperfil__icon" />
                      Mi perfil
                    </Link>
                    <Link
                      to="/my-questions"
                      className="navbar__menu__link navbar__menu__link__mobile"
                    >
                      <CiSquareQuestion className="miperfil__icon" />
                      Preguntas
                    </Link>
                    <Link
                      to="/my-valorations"
                      className="navbar__menu__link navbar__menu__link__mobile"
                    >
                      <CiStar className="miperfil__icon" />
                      Opiniones
                    </Link>
                    <Link
                      to="/favorites"
                      className="navbar__menu__link navbar__menu__link__mobile"
                    >
                      <CiHeart className="miperfil__icon" />
                      Favoritos
                    </Link>
                    <Link
                      onClick={logout}
                      to=""
                      className="navbar__menu__link navbar__menu__link__mobile text-teal-600 font-medium mt-5 text-md"
                    >
                      Cerrar sesión
                    </Link>
                    <hr className="mt-2" />
                  </div>
                ) : (
                  <div className="navbar__perfil__desktop w-full">
                    <h1 className="mb-3 font-medium text-center">
                      ¡Bienvenido!
                    </h1>
                    <GeneralBtn
                      onClick={() => {
                        navigate("/sign-in");
                      }}
                      className=""
                      style={{
                        padding: "8px 50px",
                        marginBottom: "15px",
                        width: "100%",
                        textAlign: "center",
                      }}
                      type="secondary"
                    >
                      Iniciar sesión
                    </GeneralBtn>
                    <div className="flex items-center gap-1">
                      <p className="text-sm">¿No tienes cuenta?</p>
                      <Link
                        to="/sign-up"
                        className="navbar__menu__link text-sm :active text-teal-600"
                      >
                        Registrarse
                      </Link>
                    </div>

                    <hr className="mt-2" />
                  </div>
                )}
                <div className="navbar__categories__container">
                  <Link
                    ref={categoriesBtnRef}
                    onClick={handleButtonClick}
                    className="navbar__menu__link navbar__menu__link__display"
                  >
                    Categorías
                  </Link>
                  <Categories className="categories__display" />
                </div>
                <p className="categories__title font-medium text-lg">
                  Categorías
                </p>
                <BurgerCategories className="burger-categories" />
                <Link
                  to="/carro"
                  className="navbar__menu__link navbar__menu__link__cart"
                >
                  Carrito
                  <img
                    className="navbar__menu__link__icon"
                    src={
                      cart.length > 0
                        ? "/imgs/aplication/cart_full.png"
                        : "/imgs/aplication/cart_empty.png"
                    }
                    alt=""
                  />
                  {cart.length > 0 ? (
                    <p className="cart__products__indicater">
                      {cart.length > 9 ? (
                        <span className="nine">9+</span>
                      ) : (
                        cart.length
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                </Link>
              </div>
            </div>
          </div>
          <div className="navbar__user__menu__container" ref={perfilMenuRef}>
            {userToken ? (
              <Perfil
                className="navbar__perfil__container"
                openPerfilMenu={openPerfilMenu}
                setOpenPerfilMenu={setOpenPerfilMenu}
                perfilMenuRef={perfilMenuRef}
                perfilButtonRef={perfilButtonRef}
              >
                <div className="navbar__user__menu bg-gray-50 shadow-md">
                  <div className="flex flex-col ">
                    <span className="font-semibold">{user.nombre}</span>
                    <span className="text-xs text-gray-600">{user.email}</span>
                  </div>
                  <hr className="w-full my-2" />
                  <Link to="miperfil" className="navbar__user__menu__link">
                    Mi perfil
                  </Link>
                  <Link to="/my-questions" className="navbar__user__menu__link">
                    Preguntas
                  </Link>
                  <Link
                    to="/my-valorations"
                    className="navbar__user__menu__link"
                  >
                    Opiniones
                  </Link>
                  <Link to="/createpost" className="navbar__user__menu__link">
                    Publicar
                  </Link>
                  <Link to="/favorites" className="navbar__user__menu__link">
                    Favoritos
                  </Link>
                  <hr className="w-full my-2" />
                  <Link
                    onClick={logout}
                    to=""
                    className="navbar__user__menu__link"
                  >
                    Cerrar sesión
                  </Link>
                </div>
              </Perfil>
            ) : (
              <Perfil
                className="navbar__perfil__container"
                openPerfilMenu={openPerfilMenu}
                setOpenPerfilMenu={setOpenPerfilMenu}
                perfilMenuRef={perfilMenuRef}
                perfilButtonRef={perfilButtonRef}
              >
                <div className="navbar__user__menu bg-gray-50 shadow-md">
                  <Link to="/sign-in" className="navbar__user__menu__link">
                    Iniciar sesión
                  </Link>
                  <Link to="/sign-up" className="navbar__user__menu__link">
                    Registrarse
                  </Link>
                </div>
              </Perfil>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

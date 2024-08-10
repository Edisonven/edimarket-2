import "../createPost/createPost.css";
import { useCallback, useState, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdImages } from "react-icons/io";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { UserContext } from "../../context/UserContext";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import profile from "/imgs/aplication/profile.png";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";

export function CreatePost() {
  const {
    onlyNumbersRegex,
    userData,
    inputFormError,
    setInputFormError,
    handleChange,
    inputRefs,
    image_url_regex,
    userToken,
    setUserData,
    initialUserData,
    getProductBySeller,
    user,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const { handleGetProducts } = useContext(ProductContext);
  const [createPostSuccess, setCreatePostSuccess] = useState({
    success: "",
    error: "",
  });

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });
  const { setLoading } = useContext(ProductContext);

  const handleCreatePost = async (
    nombre,
    descripcion,
    estado,
    precio,
    stock,
    imagen,
    categoria
  ) => {
    try {
      const response = await fetch(`${config.backendUrl}/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          estado,
          precio,
          stock,
          imagen,
          categoria,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir producto");
      }
      const data = response.json();

      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (userData.postimg.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPostimg: "Ingresa la URL del producto.",
      }));
    } else if (!image_url_regex.test(userData.postimg)) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPostimg: "Ingresa una URL válida.",
      }));
    } else if (userData.titulo.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorTitulo: "Pon un título a tu producto.",
      }));
    } else if (userData.precio === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPrecio: "Pon un precio a tu producto.",
      }));
    } else if (!onlyNumbersRegex.test(userData.precio)) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPrecio: "Ingresa solo números.",
      }));
    } else if (userData.categorias === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorCategorias: "Selecciona una categoria.",
      }));
    } else if (userData.productStock === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorProductStock: "Indica el stock de tu producto.",
      }));
    } else if (userData.productStock === 0) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorProductStock: "No puedes asignar stock 0.",
      }));
    } else if (!onlyNumbersRegex.test(userData.productStock)) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorProductStock: "Ingresa solo númereos.",
      }));
    } else if (userData.estado.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorEstado: "Selecciona el estado del producto.",
      }));
    } else if (userData.descripcion.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorDescripcion: "Describe tu producto.",
      }));
    } else {
      try {
        await handleCreatePost(
          userData.titulo,
          userData.descripcion,
          userData.estado,
          userData.precio,
          userData.productStock,
          userData.postimg,
          userData.categorias
        );
        setCreatePostSuccess((prevData) => ({
          ...prevData,
          success: "¡Has publicado tu producto!",
        }));
        setUserData(initialUserData);
        setTimeout(() => {
          setCreatePostSuccess((prevData) => ({
            ...prevData,
            success: "",
          }));
          navigate("/my-posts");
        }, 1500);
        handleGetProducts();
        getProductBySeller();
      } catch (error) {
        console.error("Error:", error.message);
        setCreatePostSuccess((prevData) => ({
          ...prevData,
          error: "No pudimos publicar tu producto :(",
        }));
        setTimeout(() => {
          setCreatePostSuccess((prevData) => ({
            ...prevData,
            error: "",
          }));
        }, 3000);
      }
    }
  };

  return (
    <section className="createpost__container ">
      <h1 className="text-2xl font-semibold mb-5">Nueva publicación</h1>
      <div className="createpost__card__container bg-white shadow-sm rounded-md p-3">
        <form
          onSubmit={handlePostSubmit}
          className="createpost__card__form bg-white shadow-sm mt-4 border rounded-md"
          name="post"
        >
          <div className="createpost__card__file__container mb-5">
            {/*  <div
              className="createpost__card__fileimg cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="createpost__card__fileparagraph">
                  Drop the files here ...
                </p>
              ) : (
                <div className="flex justify-center items-center gap-3">
                  <p className="createpost__card__fileparagraph font-medium">
                    Añadir imágen
                  </p>
                  <IoMdImages className="text-3xl" />
                </div>
              )}
            </div> */}

            <div className="createpost__card__imgpreview">
              {/*  {acceptedFiles[0] ? (
                <img
                  className="createpost__card__imgpreview__img"
                  src={URL.createObjectURL(acceptedFiles[0])}
                  alt=""
                />
              ) : (
                <p className="text-center">Vista previa...</p>
              )} */}
              {userData?.postimg ? (
                <img
                  className="createpost__card__imgpreview__img"
                  src={userData.postimg}
                  alt=""
                />
              ) : (
                <p className="text-center">Vista previa...</p>
              )}
            </div>
            {/* Arriba será para el drag and drop cuando se configure la subida de imágenes local*/}
          </div>
          <div className="createpost__card__data">
            <input
              ref={inputRefs.postimg}
              type="text"
              className={`createpost__card__input ${
                inputFormError.errorPostimg
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              name="postimg"
              id=""
              value={userData?.postimg}
              onChange={handleChange}
              placeholder="Ingresa la URL de la imágen"
            />
            {inputFormError.errorPostimg ? (
              <p className="text-red-600 font-semibold text-sm">
                {inputFormError.errorPostimg}
              </p>
            ) : (
              ""
            )}
            <input
              ref={inputRefs.titulo}
              onChange={handleChange}
              name="titulo"
              value={userData?.titulo}
              className={`createpost__card__input ${
                inputFormError.errorTitulo
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              type="text"
              placeholder="Título"
            />
            {inputFormError.errorTitulo ? (
              <p className="text-red-600 font-semibold text-sm">
                {inputFormError.errorTitulo}
              </p>
            ) : (
              ""
            )}
            <input
              ref={inputRefs.precio}
              onChange={handleChange}
              name="precio"
              value={userData?.precio || ""}
              className={`createpost__card__input ${
                inputFormError.errorPrecio
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              type="text"
              placeholder="Precio"
            />
            {inputFormError.errorPrecio ? (
              <p className="text-red-600 font-semibold text-sm">
                {inputFormError.errorPrecio}
              </p>
            ) : (
              ""
            )}
            <div className="createpost__select__container">
              <select
                ref={inputRefs.categorias}
                onChange={handleChange}
                className={`createpost__card__input ${
                  inputFormError.errorCategorias
                    ? "focus: outline-2 outline outline-red-600"
                    : "focus: outline-2 outline-green-300"
                }`}
                name="categorias"
                value={userData?.categorias}
                id="categorias"
              >
                <option value="">Categorías</option>
                <option value="consolas">Consolas</option>
                <option value="accesorios">Accesorios</option>
                <option value="monitores">Monitores</option>
                <option value="componentes">Componentes</option>
                <option value="telefonia">Telefonía</option>
                <option value="electrodomesticos">Electrodomésticos</option>
              </select>
              {inputFormError.errorCategorias ? (
                <p className="text-red-600 font-semibold text-sm">
                  {inputFormError.errorCategorias}
                </p>
              ) : (
                ""
              )}
              <div className="flex flex-col ">
                <input
                  value={userData?.productStock || ""}
                  onChange={handleChange}
                  ref={inputRefs.productStock}
                  className={`createpost__card__input ${
                    inputFormError.errorProductStock
                      ? "focus: outline-2 outline outline-red-600"
                      : "focus: outline-2 outline-green-300"
                  }`}
                  type="text"
                  name="productStock"
                  placeholder="Stock producto"
                />
                {inputFormError.errorProductStock ? (
                  <p className="text-red-600 font-semibold text-sm">
                    {inputFormError.errorProductStock}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <select
              ref={inputRefs.estado}
              onChange={handleChange}
              className={`createpost__card__input ${
                inputFormError.errorEstado
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              value={userData?.estado}
              name="estado"
              id="estado"
            >
              <option value="">Estado del producto</option>
              <option value="nuevo">Nuevo</option>
              <option value="usado-como-nuevo">Usado-Como nuevo</option>
              <option value="usado-aceptable">Usado-Aceptable</option>
            </select>
            {inputFormError.errorEstado ? (
              <p className="text-red-600 font-semibold text-sm">
                {inputFormError.errorEstado}
              </p>
            ) : (
              ""
            )}
            <textarea
              ref={inputRefs.descripcion}
              onChange={handleChange}
              className={`createpost__card__input resize-none ${
                inputFormError.errorDescripcion
                  ? "focus: outline-2 outline outline-red-600"
                  : "focus: outline-2 outline-green-300"
              }`}
              value={userData?.descripcion}
              name="descripcion"
              id=""
              rows="5"
              placeholder="Descripción"
            ></textarea>
            {inputFormError.errorDescripcion ? (
              <p className="text-red-600 font-semibold text-sm">
                {inputFormError.errorDescripcion}
              </p>
            ) : (
              ""
            )}
            <GeneralBtn
              type="secondary"
              disabled={false}
              className="createpost__form__btn my-4"
            >
              Crear publicación
            </GeneralBtn>
          </div>
        </form>
        <div className="createpost__preview__desktop bg-white  border rounded-md">
          <div className="createpost__preview__body bg-gray-200">
            {userData.postimg ? (
              <div className="preview__img__container">
                <img
                  className="createpost__preview__img"
                  src={userData.postimg}
                  alt=""
                />
                <img
                  className="createpost__preview__img__2"
                  src={userData.postimg}
                  alt=""
                />
              </div>
            ) : (
              <div>
                <p className="text-xl text-center mb-2 font-semibold">
                  Vista previa...
                </p>
                <p className="">Acá aparecerá tu imágen cuando la subas.</p>
              </div>
            )}
          </div>
          <div className="createpost__preview__data">
            <h1 className="createpost__preview__data__title text-3xl font-semibold mb-2">
              {userData.titulo ? (
                <p className="text-2xl font-semibold">{userData.titulo}</p>
              ) : (
                <p className="text-2xl font-semibold">Título</p>
              )}
            </h1>
            {userData.precio && !isNaN(userData.precio) ? (
              <p className="font-medium">
                {parseInt(userData.precio).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
            ) : (
              <p className="font-medium">Precio</p>
            )}
            <p className="font-medium text-lg my-5">Detalles</p>
            {userData.descripcion ? (
              <p className="detail__paragraph">{userData.descripcion}</p>
            ) : (
              <p className="mb-8">
                Aquí aparecerán los detalles de tu publicación.
              </p>
            )}
            <hr />
            <p className="mt-5">Información del vendedor</p>
            <div className="flex items-center gap-3 mt-5">
              <img className="w-12" src={profile} alt="" />
              <span className="font-medium">{user.nombre}</span>
            </div>
          </div>
        </div>
      </div>
      {createPostSuccess.success && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-green-600">
            {createPostSuccess.success}
          </p>
        </CartAlert>
      )}
      {createPostSuccess.error && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
            {createPostSuccess.error}
          </p>
        </CartAlert>
      )}
    </section>
  );
}

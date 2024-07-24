import "../sendMyValoration/sendMyValoration.css";
import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";

export function UpdateMyValoration() {
  const { ordersToValorate, userToken, fetchOrders } = useContext(UserContext);
  const { setLoading } = useContext(ProductContext);
  const [valoration, setValoration] = useState("");
  const { productId } = useParams();
  const parsedId = parseInt(productId);
  const navigate = useNavigate();
  const [userValorations, setUserValorations] = useState("");
  const [valorationUpdated, setValorationUpdated] = useState({
    success: "",
    error: "",
  });
  const productFindedById = ordersToValorate.find(
    (product) => product?.producto_id === parsedId
  );

  const handleChange = (e) => {
    setValoration(e.target.value);
  };

  const [currentScore, setCurrentScore] = useState(
    productFindedById?.calificacion
  );

  const handleGetUserValorations = async () => {
    try {
      if (productFindedById) {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/productos/valoracion/${productFindedById?.producto_id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al obtener las valoraciones"
          );
        }

        const data = await response.json();
        setUserValorations(data?.valoraciones);

        if (data) {
          const valorationsFinded = data.valoraciones.find(
            (valoracion) => valoracion.producto_id === parsedId
          );
          setValoration(valorationsFinded.comentario);
        }

        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al obtener las valoraciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUserValorations();
  }, [productFindedById]);

  const handleUpdateProductAndCommentSended = async () => {
    try {
      const response = await fetch(
        "https://backend-mu-three-82.vercel.app/productos/update-valoracion",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            idProducto: parsedId,
            comentario: valoration,
            calificacion: currentScore,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setValorationUpdated((prevState) => ({
          ...prevState,
          error: "No pudimos actualizar tu valoración",
        }));
        setValoration("");
        setTimeout(() => {
          setValorationUpdated((prevState) => ({
            ...prevState,
            error: "",
          }));
        }, 3000);
        throw new Error(
          errorData.message || "Error al actualizar producto valorado"
        );
      }
      const data = await response.json();
      fetchOrders();
      setValorationUpdated((prevState) => ({
        ...prevState,
        success: "Valoración actualizada.",
      }));
      setTimeout(() => {
        setValorationUpdated((prevState) => ({
          ...prevState,
          success: "",
        }));
        navigate("/my-valorations/completed");
      }, 1500);
      setValoration("");
      return data;
    } catch (error) {
      console.error(error.message || "Error al actualizar valoración");
      throw error;
    }
  };

  const handleUpdateProductValorated = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://backend-mu-three-82.vercel.app/venta/valorar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            orderId: productFindedById?.orderValorate_id,
            score: currentScore,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setValorationUpdated((prevState) => ({
          ...prevState,
          error: "No pudimos actualizar tu valoración",
        }));
        setValoration("");
        setTimeout(() => {
          setValorationUpdated((prevState) => ({
            ...prevState,
            error: "",
          }));
        }, 3000);
        throw new Error(
          errorData.message || "Error al actualizar producto valorado"
        );
      }
      const data = await response.json();
      handleUpdateProductAndCommentSended();
      fetchOrders();
      setValorationUpdated((prevState) => ({
        ...prevState,
        success: "Valoración actualizada.",
      }));
      setTimeout(() => {
        setValorationUpdated((prevState) => ({
          ...prevState,
          success: "",
        }));
        navigate("/my-valorations/completed");
      }, 1500);
      setValoration("");
      return data;
    } catch (error) {
      console.error(error.message || "Error al actualizar valoración");
      throw error;
    }
  };

  const handleChooseValoration = (index) => {
    const newScore = index + 1;
    setCurrentScore(newScore);
  };

  return (
    <section className="sendmyvaloration__container">
      <div className="sendmyvaloration__body bg-white shadow rounded-md p-3 min-h-[480px]">
        <h1 className="text-2xl font-semibold my-5 text-center">
          ¿Qué te pareción tu producto?
        </h1>
        <div className="flex flex-col items-center gap-5">
          <figure>
            <img
              className="w-full max-w-[150px] max-h-[130px]"
              src={productFindedById?.imagen}
              alt=""
            />
          </figure>
          <h3 className="">{productFindedById?.nombre}</h3>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            {[...new Array(5)].map((_, index) => {
              return index >= currentScore ? (
                <GoStar
                  onClick={() => handleChooseValoration(index)}
                  key={index}
                  className="star-icon scale-[2.5] cursor-pointer select-none text-gray-400 hover:bg-slate-100 p-[2px] rounded-full"
                />
              ) : (
                <GoStarFill
                  onClick={() => handleChooseValoration(index)}
                  key={index}
                  className="star-icon scale-[2.5] cursor-pointer select-none text-teal-700 hover:bg-slate-100 p-[2px] rounded-full"
                />
              );
            })}
          </div>
        </div>
        <div className="border mt-10 w-full max-w-[430px] flex flex-col items-center rounded-md mx-auto shadow-sm  p-4 sm:p-6">
          <h3 className="my-4 font-medium">
            Cuéntanos cómo te fue con tu producto
          </h3>
          <span className="mb-3 text-sm text-gray-500">(Opcional)</span>
          <form
            onSubmit={handleUpdateProductValorated}
            className="w-full h-full flex flex-col items-center"
          >
            <textarea
              onChange={handleChange}
              value={valoration}
              rows="4"
              className="border w-full h-full rounded-md resize-none focus:border-none outline-teal-500 p-3"
              name="valoration"
              id=""
            />
            <GeneralBtn
              className="mt-5 h-[45px] flex items-center"
              type="secondary"
            >
              Guardar
            </GeneralBtn>
          </form>
        </div>
      </div>
      {valorationUpdated.success && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-green-600">
            {valorationUpdated.success}
          </p>
        </CartAlert>
      )}
      {valorationUpdated.error && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
            {valorationUpdated.error}
          </p>
        </CartAlert>
      )}
    </section>
  );
}

import { useNavigate } from "react-router-dom";
import ediFeliz from "/imgs/aplication/edi-feliz.svg";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import "../paymentSuccess/paymentSuccess.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Loader } from "../../components/loader/Loader";
import ediTriste from "/imgs/aplication/edi-triste.png";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const { userToken } = useContext(UserContext);
  const tokenWs = urlParams.get("token_ws");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleConfirmTransaction = async () => {
    if (tokenWs) {
      try {
        const response = await fetch(
          "http://localhost:3000/webpayplus/transaction-confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ token_ws: tokenWs }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error de datos");
        }

        const data = await response.json();
      } catch (error) {
        setError(error.message || "Error al confirmar la transacción");
      } finally {
        setLoading(false);
      }
    } else {
      setError("No se encontró token_ws en la URL");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleConfirmTransaction();
  }, []);

  const handleTryAgain = () => {
    navigate("/billing");
  };

  return (
    <div className="paymentsucces__container py-10 flex flex-col items-center justify-center">
      {loading ? (
        <div>
          <h3 className="font-medium">Confirmando transacción...</h3>
          <Loader />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-col gap-[20px]">
          <h2 className="font-medium text-center">
            Ha ocurrido un error en la transacción.
          </h2>
          <img className="w-full max-w-[150px]" src={ediTriste} alt="logo" />
          <h3 className="font-medium text-center">
            Por favor, inténtalo nuevamente
          </h3>
          <GeneralBtn onClick={() => handleTryAgain()} type="primary">
            Reintentar
          </GeneralBtn>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div>
            <h1 className="text-center">Compra Exitosa</h1>
            <h3 className="text-center mt-3">¡Muchas gracias por tu compra!</h3>
          </div>
          <div>
            <img
              src={ediFeliz}
              alt="Compra Exitosa"
              className="mt-8 mb-10 w-full max-w-[150px]"
            />
          </div>
          <div>
            <GeneralBtn
              onClick={() => {
                navigate("/");
              }}
              type="primary"
            >
              Seguir comprando
            </GeneralBtn>
          </div>
        </div>
      )}
    </div>
  );
}

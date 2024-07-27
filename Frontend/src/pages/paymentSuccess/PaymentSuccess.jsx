import { useNavigate } from "react-router-dom";
import ediFeliz from "/imgs/aplication/edi-feliz.svg";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import "../paymentSuccess/paymentSuccess.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

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
        console.log("Transacción confirmada:", data);
      } catch (error) {
        setError(error.message || "Error al confirmar la transacción");
        console.error("Error al confirmar la transacción:", error);
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

  if (loading) {
    return <p>Confirmando transacción...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="paymentsucces__container py-10 flex flex-col items-center justify-center">
      <div>
        <h1 className="text-center">Compra Exitosa</h1>
        <h3 className="text-center mt-3">¡Muchas gracias por tu compra!</h3>
      </div>
      <div>
        <img src={ediFeliz} alt="Compra Exitosa" className="h-64 mt-8 mb-10" />
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
  );
}

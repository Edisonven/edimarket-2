import { useNavigate } from "react-router-dom";
import ediFeliz from "/imgs/aplication/edi-feliz.svg";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import "../paymentSuccess/paymentSuccess.css";

export function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="paymentsucces__container py-10 flex flex-col items-center jusitfy-center">
      <div>
        <h1 className="text-center">Compra Exitosa</h1>
        <h3 className="text-center mt-3">¡Muchas gracias por tu compra!</h3>
      </div>
      <div>
        <img src={ediFeliz} alt="" className="h-64 mt-8 mb-10" />
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

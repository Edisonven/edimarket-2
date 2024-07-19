import { useNavigate } from "react-router-dom";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import noAddress from "/imgs/aplication/no-address.png";

export function NoAddressAdded() {
  const navigate = useNavigate();

  const handleAddAddresses = () => {
    navigate("/user-address");
  };

  return (
    <section className="flex flex-col align-center justify-center max-w-[1000px] mx-auto min-h-[480px] bg-white shadow-sm rounded-md">
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="text-center">No has añadido ninguna dirección</h1>
        <figure>
          <img className="w-full max-w-[120px]" src={noAddress} alt="" />
        </figure>
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-center font-medium">Por favor, rellena la información de entrega para continuar</p>
          <GeneralBtn type="primary" className="" onClick={handleAddAddresses}>
            Añadir dirección
          </GeneralBtn>
        </div>
      </div>
    </section>
  );
}

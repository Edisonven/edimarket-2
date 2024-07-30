import { useNavigate } from 'react-router-dom';
import { GeneralBtn } from '../generalBtn/GeneralBtn'
import card from "/imgs/aplication/card.png"

export function NoPaymentMethodsAdded() {

  const navigate = useNavigate();

  const handleAddCard = () => {
    navigate("/my-credit-cards");
  }

  return (
<section className="flex flex-col align-center justify-center max-w-[1000px] mx-auto  bg-white shadow-sm rounded-md">
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="text-center">No has añadido ningún método de pago</h1>
        <figure>
          <img className="w-full max-w-[120px] rounded-md" src={card} alt="" />
        </figure>
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-center font-medium">Por favor, añade un método de pago para continuar</p>
          <GeneralBtn type="primary" className="" onClick={handleAddCard}>
            Añadir tarjeta
          </GeneralBtn>
        </div>
      </div>
    </section>
  )
};
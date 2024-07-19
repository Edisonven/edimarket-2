import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";

export function Completed({ orders }) {
  const valoradedProducts = orders.filter((order) => order.valorado === true);

  return (
    <section className="flex flex-col gap-5">
      <p className="text-gray-400">¡Gracias por tu valoración!</p>
      <div className="flex flex-col gap-5">
        {valoradedProducts?.length > 0 ? (
          valoradedProducts?.map((order) => {
            return (
              <div
                className="border rounded-md p-3 flex flex-col md:flex-row items-center  gap-3 sm:gap-[25px] md:justify-between px-6"
                key={order?.orderValorate_id}
              >
                <div className="flex items-center gap-3 w-full">
                  <figure className="border rounded-md shadow">
                    <img className="w-[80px]" src={order?.imagen} alt="" />
                  </figure>
                  <div className="overflow-hidden w-full">
                    <p className="w-full font-medium whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px] sm:max-w-[500px] md:max-w-[300px]">
                      {order?.nombre}
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-col gap-3 sm:flex-row-reverse  sm:justify-center sm:gap-10 justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      comprado el {order?.fecha_venta}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-3 sm:mt-0">
                    {[...new Array(5)].map((_, index) =>
                      index < order?.calificacion ? (
                        <GoStarFill
                          key={index}
                          className="star-icon scale-[2.5] select-none text-teal-700 p-[2px] rounded-full"
                        />
                      ) : (
                        <GoStar
                          key={index}
                          className="star-icon scale-[2.5] select-none text-gray-400 p-[2px] rounded-full"
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="w-full flex items-center justify-end">
                  <GeneralBtn className="max-w-[175px] h-[45px] flex items-center justify-center text-sm" type="secondary">
                    Editar opinión
                  </GeneralBtn>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-6">
            <h2 className="text-center">¡Estás al día con las valoraciones!</h2>
            <p className="text-center">
              Cuando hagas compras, podrás valorarlas acá.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

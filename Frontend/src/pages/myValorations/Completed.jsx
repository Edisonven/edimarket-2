import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";

export function Completed({ orders }) {
  const valoradedProducts = orders.filter((order) => order.valorado === true);

  return (
    <section className="">
      <p className="text-gray-400">¡Gracias por tu valoración!</p>
      <div>
        {valoradedProducts?.length > 0 ? (
          valoradedProducts?.map((order) => {
            return (
              <div
                className="border rounded-md p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-[25px]"
                key={order?.orderValorate_id}
              >
                <div className="flex items-center gap-3 ">
                  <figure className="border rounded-md shadow">
                    <img className="w-[80px]" src={order?.imagen} alt="" />
                  </figure>
                  <div className="overflow-hidden w-full">
                    <p className="w-full font-medium whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px] md:max-w-[400px]">
                      {order?.nombre}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
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

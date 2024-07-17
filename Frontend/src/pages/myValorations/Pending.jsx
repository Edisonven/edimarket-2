import { StarRating } from "./StarRating";

export function Pending({ orders }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-400">
        Valora tus productos y ayuda a las demás personas
      </p>
      {orders?.length > 0 ? (
        orders.map((order) => {
          return (
            <div
              className="border rounded-md p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-[25px]"
              key={order?.id}
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
              <StarRating order={order} orderId={order?.id} />
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full mt-6">
          <h3>No has hecho preguntas aún.</h3>
          <p>Cuando hagas preguntas aparecerán acá.</p>
        </div>
      )}
    </div>
  );
}

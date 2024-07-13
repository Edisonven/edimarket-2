import { useContext, useState } from "react";
import "../myValorations/myValorations.css";
import { UserContext } from "../../context/UserContext";
import { StarRating } from "./StarRating";
import { ProductContext } from "../../context/ProductContext";
import { Loader } from "../../components/loader/Loader";

export function MyValorations() {
  const { orders } = useContext(UserContext);
  const { loading } = useContext(ProductContext);

  return (
    <section className="myvalorations__container">
      <h1 className="text-2xl font-semibold mb-5">Mis valoraciones</h1>
      <div className="myvalorations__body bg-white shadow-sm rounded-md p-3 h-[480px]">
        <p className="mb-5">
          Valora los productos y ayuda a las demás personas
        </p>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-5">
            {orders.length > 0 ? (
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
                      <div>
                        <p className="font-medium">{order?.nombre}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        comprado el {order?.fecha_venta}
                      </p>
                    </div>
                    <StarRating order={order} />
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
        )}
      </div>
    </section>
  );
}

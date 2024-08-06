import { useEffect, useState, useContext } from "react";
import classNames from "classnames";
import { Loader } from "../../components/loader/Loader";
import { UserContext } from "../../context/UserContext";
import myOrders from "./myOrders.module.css";
import delivery from "/imgs/aplication/delivery.png";
import { ProductContext } from "../../context/ProductContext";
import { OrdersPagination } from "./OrdersPagination";

export function MyOrders() {
  const { orders, page, setPage, limit, totalPage, total, setOrderBy } =
    useContext(UserContext);
  const { loading } = useContext(ProductContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("es-ES", options).toUpperCase();
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

  return (
    <section
      className={classNames(
        "myOrders__container pt-10 ",
        myOrders.myOrders__container
      )}
    >
      <h1 className="text-2xl font-semibold mb-5">Mis compras</h1>
      <div className="orders_box bg-white shadow-sm rounded-md p-3 flex flex-col">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center h-full gap-5">
            {orders.length > 0 ? (
              orders.map((order, index) => {
                return (
                  <div
                    className={classNames(
                      "order_box flex flex-row w-full border shadow-sm rounded-md gap-2 max-w-[800px] mx-auto",
                      myOrders.order__container
                    )}
                    key={`${order?.producto_id}_${index}`}
                  >
                    <div>
                      <h2 className="pb-2 text-base sm:text-lg">
                        Número de órden: #
                        {`${order?.producto_id * 10 + order?.id}`}
                      </h2>
                      <p className="text-sm mb-3">
                        Fecha de compra: {order?.fecha_venta}
                      </p>
                      <p className="font-semibold">
                        {formatearPrecio(order?.valor_total)}
                      </p>
                    </div>
                    <figure className="w-[100px] h-[80px] sm:w-[150px]h-[120px]">
                      <img
                        className="w-[80px] h-[60px] sm:w-full sm:h-full object-contain"
                        src={order?.imagen}
                        alt=""
                      />
                    </figure>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center gap-12">
                <h2 className="text-center font-semibold text-3xl">
                  Aún no tienes compras.
                </h2>
                <p>Cuando compres , tus compras aparecerán acá</p>
                <img className="w-[200px]" src={delivery} alt="" />
              </div>
            )}
          </div>
        )}
        <OrdersPagination
          limit={limit}
          page={page}
          totalPage={totalPage}
          setPage={setPage}
          total={total}
          setOrderBy={setOrderBy}
          className="self-end mt-3"
        />
      </div>
    </section>
  );
}

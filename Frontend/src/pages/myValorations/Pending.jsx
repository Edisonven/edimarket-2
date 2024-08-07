import star from "/imgs/aplication/estrella3.png";
import { StarRating } from "./StarRating";
import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../context/ProductContext";
import { UserContext } from "../../context/UserContext";
import config from "../../config/config";
import { Loader } from "../../components/loader/Loader";

export function Pending() {
  const [totalPage, setTotalPage] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [order_by, setOrderBy] = useState("fecha_venta-desc");
  const [notValoradedProducts, setNotValoratedProducts] = useState([]);
  const { setLoading, handleProductDetail, loading } =
    useContext(ProductContext);
  const { user, userToken } = useContext(UserContext);

  const handlePendingOrders = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario/valorar/pending/?idUsuario=${user.id}&page=${page}&limits=${limit}&order_by=${order_by}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching orders");
        }

        const { results, count } = await response.json();
        setTotal(count);
        setNotValoratedProducts(results);
      }
    } catch (error) {
      console.error(error.message || "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePendingOrders();
  }, [page]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-400">
        Valora tus productos y ayuda a las demás personas
      </p>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="">
          {notValoradedProducts?.length > 0 ? (
            notValoradedProducts?.map((order) => {
              return (
                <div
                  className="border rounded-md p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-[25px] px-6"
                  key={order?.orderValorate_id}
                >
                  <div
                    onClick={() => handleProductDetail(order?.producto_id)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <figure className="border rounded-md shadow">
                      <img
                        className="w-[80px] h-[60px] object-contain"
                        src={order?.imagen}
                        alt=""
                      />
                    </figure>
                    <div className="overflow-hidden w-full">
                      <p className="w-full font-medium whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px] md:max-w-[400px]">
                        {order?.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center flex-col gap-3 sm:flex-row-reverse justify-evenly w-full">
                    <div>
                      <p className="text-sm text-gray-500">
                        comprado el {order?.fecha_venta}
                      </p>
                    </div>
                    <StarRating order={order} orderId={order?.id} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-6">
              <h2 className="text-center">
                ¡Estás al día con las valoraciones!
              </h2>
              <figure>
                <img className="w-full max-w-[200px] py-5" src={star} alt="" />
              </figure>
              <p className="text-center">
                Cuando hagas compras, podrás valorarlas acá.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

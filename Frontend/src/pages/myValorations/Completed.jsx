import { GoStar } from "react-icons/go";
import { GoStarFill } from "react-icons/go";
import { GeneralBtn } from "../../components/generalBtn/GeneralBtn";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import { UserContext } from "../../context/UserContext";
import { CompletedPagination } from "./CompletedPagination";
import { Loader } from "../../components/loader/Loader.jsx";

export function Completed() {
  const { handleProductDetail, setLoading, loading } =
    useContext(ProductContext);
  const { userToken, user } = useContext(UserContext);
  const [valoradedProducts, setValoratedProducts] = useState([]);
  const [likedValorations, setLikedValorations] = useState([]);
  const [prevPage, setPrevPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [order_by, setOrderBy] = useState("fecha_venta-desc");
  const naviagate = useNavigate();

  const handleOrdersToValorate = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const response = await fetch(
          `${config.backendUrl}/usuarios/usuario/valorar/?idUsuario=${user.id}&page=${page}&limits=${limit}&order_by=${order_by}`,
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
        setValoratedProducts(results);
      }
    } catch (error) {
      console.error(error.message || "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToEdit = (productId) => {
    if (productId) {
      naviagate(`/edit-my-valoration/${productId}`);
    }
  };

  useEffect(() => {
    handleOrdersToValorate();
  }, [page]);

  const handleGetLikesFromMyValorations = async () => {
    setLoading(true);
    try {
      if (userToken) {
        const getLikes = async (id) => {
          const response = await fetch(
            `${config.backendUrl}/venta/likes/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error de datos");
          }
          const data = await response.json();
          return data;
        };

        const newData = [];
        if (valoradedProducts) {
          for (const valoration of valoradedProducts) {
            const data = await getLikes(valoration.producto_id);
            newData.push(data);
          }
        }

        if (newData.length > 0) {
          setLikedValorations(newData);
        }
      }
    } catch (error) {
      console.error(error.message || "Error al obtener likes de valoraciones");
    } finally {
      setLoading(false);
    }
  };

  /*   useEffect(() => {
    handleGetLikesFromMyValorations();
  }, []); */

  return (
    <section className="flex flex-col gap-5">
      <p className="text-gray-400">¡Gracias por tu valoración!</p>
      <div className="flex flex-col gap-5">
        {valoradedProducts?.length > 0 ? (
          loading ? (
            <Loader />
          ) : (
            valoradedProducts?.map((order) => {
              return (
                <div
                  className="border rounded-md p-3 flex flex-col md:flex-row items-center  gap-3 sm:gap-[25px] md:justify-between px-6"
                  key={order?.orderValorate_id}
                >
                  <div
                    onClick={() => handleProductDetail(order?.producto_id)}
                    className="flex items-center gap-3 w-full cursor-pointer"
                  >
                    <figure className="border rounded-md shadow">
                      <img
                        className="w-[80px] h-[60px] object-contain"
                        src={order?.imagen}
                        alt=""
                      />
                    </figure>
                    <div className="overflow-hidden w-full">
                      <p className="w-full font-medium whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px] sm:max-w-[500px] md:max-w-[250px] lg:max-w-[300px]">
                        {order?.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5 md:gap-10 justify-between w-full">
                    <div className="w-full">
                      <p className="text-sm text-gray-500 whitespace-normal lg:whitespace-nowrap ">
                        comprado el {order?.fecha_venta}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 my-3 sm:my-0">
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
                    <div className="flex gap-1">
                      <BsFillHandThumbsUpFill className="text-[24px] text-gray-400" />
                      <span>0</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-end mt-5 sm:mt-0">
                    <GeneralBtn
                      onClick={() => handleNavigateToEdit(order?.producto_id)}
                      className="max-w-[175px] h-[45px] flex items-center justify-center text-sm whitespace-nowrap"
                      type="secondary"
                    >
                      Editar opinión
                    </GeneralBtn>
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-6">
            <h2 className="text-center">¡Estás al día con las valoraciones!</h2>
            <p className="text-center">
              Cuando hagas compras, podrás valorarlas acá.
            </p>
          </div>
        )}
        <CompletedPagination
          page={page}
          setPage={setPage}
          total={total}
          order_by={order_by}
          limit={limit}
          setOrderBy={setOrderBy}
          className="self-end mt-3"
        />
      </div>
    </section>
  );
}

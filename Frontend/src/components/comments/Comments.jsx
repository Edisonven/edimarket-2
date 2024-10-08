import "../comments/comments.css";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { BsHandThumbsDown } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { Loader } from "../loader/Loader";
import config from "../../config/config";

export function Comments() {
  const { userValorations, productById, setLoading, loading } =
    useContext(ProductContext);
  const { userToken, user } = useContext(UserContext);
  const { id } = useParams();
  const parsedId = parseInt(id);
  const [califications, setCalifications] = useState([]);

  const productId = userValorations.find(
    (product) => product.producto_id === productById.producto_id
  );

  const handleGetCalificationsProduct = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/venta/calificar/${parsedId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la respuesta");
      }

      const data = await response.json();
      setCalifications(data);
      return data;
    } catch (error) {
      console.error(error.message || "Error al obtener calificaicones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCalificationsProduct();
  }, [userToken]);

  const handleSendMyCalification = async (valoration) => {
    const calificationAlreadyExists = califications.some(
      (cal) =>
        cal.calificacion_id === valoration.id && cal.usuario_id === user?.id
    );

    try {
      if (calificationAlreadyExists) {
        const calificationFound = califications.find(
          (cal) =>
            cal.calificacion_id === valoration.id && cal.usuario_id === user?.id
        );

        const response = await fetch(`${config.backendUrl}/venta/calificar`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            calificacion: calificationFound.positiva
              ? !calificationFound.positiva
              : true,
            calificationId: calificationFound?.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener datos");
        }
        const data = await response.json();
        handleGetCalificationsProduct();
        return data;
      } else {
        const response = await fetch(`${config.backendUrl}/venta/calificar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            productId: parsedId,
            calificacionId: valoration.id,
            positiva: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al enviar la calificación"
          );
        }
        const data = await response.json();
        handleGetCalificationsProduct();
        return data;
      }
    } catch (error) {
      console.error(error.message || "Error al enviar calificación");
    }
  };

  const valorationsFiltered = userValorations.reduce((acc, curr) => {
    const { fecha, usuario_id } = curr;

    const existingValorate = acc.find(
      (element) => element.usuario_id === usuario_id
    );

    if (existingValorate) {
      const currentFecha = new Date(fecha);
      const existingFecha = new Date(existingValorate.fecha);

      if (currentFecha > existingFecha) {
        acc = acc.map((element) =>
          element.usuario_id === usuario_id ? curr : element
        );
      }
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  return (
    <section className="comments__container">
      <h1 className="text-2xl mt-5">Valoraciones</h1>
      <p className="mt-5">
        Deja tu valoración al comprar para que otras personas conozcan sobre
        este producto.
      </p>
      <div className="comments__container flex flex-col gap-5">
        {productId?.producto_id === productById?.producto_id ? (
          <div className="opiniones__container">
            <h3 className="my-3 font-medium">Opiniones</h3>
            {califications.length === 0 && loading ? (
              <Loader className="scale-[0.6] h-full" />
            ) : (
              <div className="opiniones__body flex flex-col">
                {valorationsFiltered.map((valoration) => (
                  <div key={valoration.id} className="">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 w-full ">
                        <p className="text-sm font-medium">
                          {" "}
                          {valoration?.usuario.split(" ")[0]}{" "}
                          {valoration?.usuario.split(" ")[1]?.charAt(0)}.
                        </p>
                        <span className="flex items-center gap-1">
                          {[...new Array(5)].map((_, index) =>
                            index < valoration?.calificacion ? (
                              <GoStarFill
                                className="star-icon text-sm sm:text-[15px] select-none text-teal-700 rounded-full"
                                key={index}
                              />
                            ) : (
                              <GoStar
                                className="star-icon text-sm sm:text-[15px] select-none text-gray-400 rounded-full"
                                key={index}
                              />
                            )
                          )}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">
                          {valoration?.fecha}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-normal pl-3">
                        {valoration?.comentario}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div
                          onClick={() =>
                            userToken
                              ? handleSendMyCalification(valoration)
                              : null
                          }
                          className={`flex items-center gap-2 cursor-pointer hover:outline outline-teal-500 outline-1 rounded-xl px-2 py-[1px] select-none ${
                            califications.some(
                              (cal) =>
                                cal.positiva === true &&
                                cal.calificacion_id === valoration.id &&
                                cal.usuario_id === user?.id
                            )
                              ? "bg-teal-500 shadow-md text-white"
                              : ""
                          }`}
                        >
                          {califications.some(
                            (cal) =>
                              cal.positiva === true &&
                              cal.calificacion_id === valoration.id &&
                              cal.usuario_id === user?.id
                          ) ? (
                            <BsFillHandThumbsUpFill />
                          ) : (
                            <BsHandThumbsUp />
                          )}

                          <span className="text-sm font-medium">
                            {
                              califications.filter(
                                (cal) =>
                                  cal.calificacion_id === valoration.id &&
                                  cal.positiva === true
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:outline outline-teal-500 outline-1 rounded-xl px-2 select-none">
                          <BsHandThumbsDown />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                    <hr className="my-5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center w-full my-8">
            Aún no hay valoraciones. ¡Compra y deja tu valoración!
          </p>
        )}
      </div>
    </section>
  );
}

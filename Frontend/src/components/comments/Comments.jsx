import "../comments/comments.css";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsHandThumbsDown } from "react-icons/bs";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

export function Comments() {
  const { userValorations, productById } = useContext(ProductContext);

  const productId = userValorations.find(
    (product) => product.producto_id === productById.producto_id
  );

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
            <div className="opiniones__body flex flex-col">
              {userValorations.map((valoration) => (
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
                    <p className="font-normal pl-3">{valoration?.comentario}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 cursor-pointer hover:outline outline-teal-500 outline-1 rounded-xl px-2 select-none">
                        <BsHandThumbsUp />
                        <span>0</span>
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

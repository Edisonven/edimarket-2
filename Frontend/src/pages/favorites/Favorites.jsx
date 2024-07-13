import { useContext, useEffect, useState } from "react";
import "../favorites/favorites.css";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { UserContext } from "../../context/UserContext";
import { Loader } from "../../components/loader/Loader";

export function Favorites() {
  const { handleProductDetail, addedToFav, loading, productAlert } =
    useContext(ProductContext);

  const { handleDeleteFav } = useContext(UserContext);

  return (
    <section className="favorites__container ">
      <h1 className="text-2xl font-semibold mb-5">Mis favoritos</h1>
      <div className="">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className="favorites__cards__container bg-white shadow-sm rounded-md p-3 h-[480px]">
              {addedToFav.length > 0 ? (
                addedToFav.map((product) => {
                  return (
                    <ProductCard
                      onClick={() => handleProductDetail(product?.producto_id)}
                      key={product.id}
                      className="max-w-[800px] mx-auto w-full"
                    >
                      <div className="favorites__card__body">
                        <img
                          className="favorites__card__img shadow-md w-full"
                          src={product.imagen}
                          alt=""
                        />
                        <div className="favorites__card__info">
                          <p className="favorites__card__paragraph text-md font-light text-lg text-ellipsis whitespace-nowrap overflow-hidden">
                            {product.nombre}
                          </p>
                          <p className="favorites__card__info">
                            {product.precio
                              ? Number(product.precio).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                              : null}
                          </p>
                          <button
                            onClick={(e) => handleDeleteFav(e, product?.id)}
                            className="favorites__card__info__btn font-bold text-blue-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </ProductCard>
                  );
                })
              ) : (
                <div className="nofavorites__container">
                  <h1 className="nofavorites__title text-center font-semibold text-3xl">
                    Aún no tienes favoritos
                  </h1>
                  <p className="nofavorites__paragraph text-center">
                    Cuando añadas productos a favoritos aparererán acá.
                  </p>
                  <img
                    className="nofavorites__icon"
                    src="/imgs/aplication/fav_heart.png"
                    alt=""
                  />
                </div>
              )}
            </div>

            {productAlert.errorFav ? (
              <CartAlert>
                <div>
                  <p className="card__cart__alert shadow-md rounded-md bg-slate-700">
                    {productAlert.errorFav}
                  </p>
                </div>
              </CartAlert>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </section>
  );
}

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import star from "/imgs/aplication/estrella.png";
import "../../components/productCard/productCard.css";

export function ProductCard({ className, onClick, product }) {
  const { user } = useContext(UserContext);
  return (
    <div
      onClick={onClick}
      className={`${className} products__card shadow-md bg-white`}
    >
      <div className="products__card__img__container">
        {user?.id === product?.vendedor_id ? (
          <figure className="product__star__container">
            <span className="font-semibold">Mi producto</span>
            <img className="product__star__icon" src={star} alt="" />
          </figure>
        ) : (
          ""
        )}
        <img
          className="products__card__img"
          src={
            product?.imagen
              ? product?.imagen
              : "/imgs/aplication/img-notfound.png"
          }
          alt={product?.nombre}
        />
        <div className="products__card__desc__container px-4">
          <p className="products__card__paragraph pt-8 text-left">
            {product?.nombre}
          </p>
          <h6 className="products__card__paragraph pb-8 text-left">
            {product?.precio.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </h6>
        </div>
      </div>
    </div>
  );
}

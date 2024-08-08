import { Products } from '../../components/products/Products'
import { ProductCardTwo } from '../../components/productCard/ProductCardTwo'
import "../productDetail/productDetail.css";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { CartAlert } from "../../components/cartAlert/CartAlert";
import { useRef } from 'react';
import { GeneralBtn } from '../../components/generalBtn/GeneralBtn';

export function PublishedProduct() {
  const { productById, addToFav, addedToFav } = useContext(ProductContext);
  const {
    productAlreadyInCart,
    setProductAlreadyInCart,
  } = useContext(CartContext);
  const timeoutRef = useRef(null);

  return (
    <>
      <h1>Nombre producto</h1>
      <section className="productdetail__container">
        <div className="card__container">
          <ProductCard className="card__body shadow-md rounded-md">
            <img className="card__img" src={productById?.href} alt="" />
            <div className="card__info border-2 rounded-md">
              <div className="card__info__details">
                <p className="card__paragraph card__paragraph__name">
                  {productById?.nombre}
                </p>
                <div className="card__info__price__details">
                  {/* <p className="card__paragraph card__paragraph__price">
                  {productById?.precio.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </p> */}
                </div>

                <p className="card__paragraph card__paragraph__stock">
                  Stock disponible{" "}
                  <span className="font-semibold">{productById?.stock}</span>
                </p>
              </div>
              <div className="card__info__btn__container">
              </div>
              <hr className="mt-8" />
            </div>
            <div className="card__info__desc__container mt-8 p-4">
              <h1 className="card__info__desc__title text-2xl">Descripción</h1>
              <div className="card__info__desc mt-10">
                {productById?.descripcion}
              </div>
            </div>
          </ProductCard>
          <GeneralBtn type="primary">
            {/* acá se deben poder editar los campos del producto, se abrirá un form? */}
            Editar
          </GeneralBtn>
        </div>
      </section>
      {/* acá similar a la pdp */}
    </>
  )
}


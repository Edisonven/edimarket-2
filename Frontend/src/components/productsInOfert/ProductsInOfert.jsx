import "../productsInOfert/productsInOfert.css";
import { useContext, useEffect, useState } from "react";
import { ProductCard } from "../productCard/ProductCard";
import { UserContext } from "../../context/UserContext";
import star from "/imgs/aplication/estrella.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings } from "../reactslick/ReactSlickSlider.jsx";
import Slider from "react-slick";

export function ProductsInOfert() {
  const [products, setProducts] = useState([]);
  const telephoneCategory = 5;
  const { user } = useContext(UserContext);

  const handleGetProductInOfert = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/productos/ofert/${telephoneCategory}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los datos");
      }
      const data = await response.json();
      setProducts(data);
      return data;
    } catch (error) {
      console.error(error.message || "Error al obtener productos en oferta");
    }
  };

  useEffect(() => {
    handleGetProductInOfert();
  }, []);

  return (
    <section className="productsinofert__container bg-white shadow-sm rounded-md">
      <h1 className="text-2xl font-semibold my-7">productos en oferta</h1>
      <div className="productsinofert__body ">
        <Slider {...settings}>
          {products?.map((product) => (
            <ProductCard
              onClick={() => handleProductDetail(product?.id)}
              key={product.id}
              className="products__card shadow-md bg-white"
            >
              <div className="products__card__img__container">
                {user.id === product?.vendedor ? (
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
                    {product?.precio_oferta}
                  </h6>
                </div>
              </div>
            </ProductCard>
          ))}
        </Slider>
      </div>
    </section>
  );
}

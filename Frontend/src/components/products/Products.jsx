import "../products/products.css";
import { useContext, useEffect } from "react";
import { ProductCard } from "../../components/productCard/ProductCard.jsx";
import { ProductContext } from "../../context/ProductContext.jsx";
import { Loader } from "../loader/Loader.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import star from "/imgs/aplication/estrella.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { settings } from "../reactslick/ReactSlickSlider.jsx";
import { Link } from "react-router-dom";

export function Products() {
  const { products, handleProductDetail, loading } = useContext(ProductContext);
  const { userToken, user } = useContext(UserContext);
  console.log(products);
  return (
    <section>
      <div className="products__container">
        <div className="product__title__container">
          <h1 className="products__title text-2xl font-semibold my-7">
            Lo más reciente
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="">
            {userToken ? (
              <div className="">
                <Link
                  to="/all-products"
                  className="block w-[160px] ml-auto mb-3 font-semibold text-base hover:text-teal-500 hover:underline"
                >
                  Ver más productos
                </Link>
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
                            <img
                              className="product__star__icon"
                              src={star}
                              alt=""
                            />
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
                    </ProductCard>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="">
                <Link
                  to="/all-products"
                  className="block w-[160px] ml-auto mb-3 font-semibold text-base hover:text-teal-500 hover:underline"
                >
                  Ver más productos
                </Link>
                <Slider {...settings}>
                  {products?.map((product) => (
                    <ProductCard
                      onClick={() => handleProductDetail(product?.id)}
                      key={product.id}
                      className="products__card shadow-md bg-white"
                    >
                      <div className="products__card__img__container">
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
                          <h6 className="products__card__paragraph pb-8 text-left ">
                            {product?.precio.toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}
                          </h6>
                        </div>
                      </div>
                    </ProductCard>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

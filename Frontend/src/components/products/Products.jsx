import "../products/products.css";
import { useContext, useEffect } from "react";
import { ProductCard } from "../../components/productCard/ProductCard.jsx";
import { ProductContext } from "../../context/ProductContext.jsx";
import { Loader } from "../loader/Loader.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { settings } from "../reactslick/ReactSlickSlider.jsx";
import { Link } from "react-router-dom";

export function Products() {
  const { products, handleProductDetail, loading } = useContext(ProductContext);
  const { userToken } = useContext(UserContext);

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
                      key={product?.id}
                      product={product}
                    />
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
                      product={product}
                    />
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

import "../productsInOfert/productsInOfert.css";
import { useContext, useEffect, useState } from "react";
import { ProductCard } from "../productCard/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings } from "../reactslick/ReactSlickSlider.jsx";
import Slider from "react-slick";
import { ProductContext } from "../../context/ProductContext.jsx";
import config from "../../config/config.js";
import { Loader } from "../loader/Loader.jsx";
import { Link } from "react-router-dom";

export function ProductsInOfert() {
  const [products, setProducts] = useState([]);
  const { handleProductDetail, setLoading, loading } =
    useContext(ProductContext);

  const handleGetProductInOfert = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendUrl}/productos/productos/oferts`
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProductInOfert();
  }, []);

  return (
    <section className="productsinofert__container bg-white shadow-sm rounded-md">
      <h1 className="text-2xl font-semibold my-7">productos en oferta</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="productsinofert__body ">
          <Link
            to=""
            className="block w-[160px] ml-auto mb-3 font-semibold text-base hover:text-teal-500 hover:underline"
          >
            Ver Todos
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
    </section>
  );
}

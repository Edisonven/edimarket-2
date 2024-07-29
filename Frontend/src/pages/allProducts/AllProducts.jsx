import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { Loader } from "../../components/loader/Loader";
import { UserContext } from "../../context/UserContext";
import { Pagination } from "../../components/pagination/Pagination.jsx";
import "../allProducts/allProducts.css";

export function AllProducts() {
  const {
    handleProductDetail,
    loading,
    products,
    page,
    order_by,
    setOrder_by,
  } = useContext(ProductContext);

  const navigate = useNavigate();

  const handleSortChange = (event) => {
    setOrder_by(event.target.value);
  };

  useEffect(() => {
    if (navigate) {
      setOrder_by("");
    }
  }, [navigate]);

  useEffect(() => {
    if (page !== 1) {
      window.scrollTo(0, 0);
    }
  }, [page]);

  return (
    <div className="product__list__container">
      <div className="products__container">
        <h1 className="products__title text-2xl font-semibold">
          Todos los productos
        </h1>

        <div>
          <div className="product__list__filters">
            <select
              onChange={handleSortChange}
              className="products__filter shadow-sm rounded-md py-1 px-2 w-56 text-center my-10 border border-gray-300"
              name="order_by"
              id="order_by"
              value={order_by}
            >
              <option className="text-start cursor-pointer" value="">
                Ordenar por
              </option>
              <option className="text-start cursor-pointer" value="precio_asc">
                Menor precio
              </option>
              <option className="text-start cursor-pointer" value="precio_desc">
                Mayor precio
              </option>
            </select>
            <Pagination />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="products__cards__container">
              {products?.map((product) => (
                <ProductCard
                  onClick={() => handleProductDetail(product?.id)}
                  key={product?.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

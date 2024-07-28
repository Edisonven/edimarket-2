import "../../pages/productList/productList.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { Loader } from "../../components/loader/Loader";
import { UserContext } from "../../context/UserContext";
import { PaginationCategory } from "../../components/pagination/PaginationCategory";
import star from "/imgs/aplication/estrella.png";
import config from "../../config/config";

export function ProductList() {
  const { categoria } = useParams();
  const { handleProductDetail, loading, setLoading } =
    useContext(ProductContext);
  const [orderBy, setOrderBy] = useState("");
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { user, userToken } = useContext(UserContext);
  const [totalPage, setTotalPage] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  const handleGetFilteredProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.backendUrl}/categorias/${categoria}?page=${page}&limits=${limit}`
      );
      if (!response.ok) {
        throw new Error("Producto no encontrado");
      }
      const { productos_totales, productos_totales_pagina, results } =
        await response.json();

      setFilteredProducts(results);
      setTotalProducts(productos_totales);
      setTotalPage(productos_totales_pagina);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  let sortedProducts = [...filteredProducts];

  useEffect(() => {
    handleGetFilteredProducts();
  }, [categoria, page]);

  const handleSortChange = (event) => {
    setOrderBy(event.target.value);
  };

  useEffect(() => {
    if (navigate) {
      setOrderBy("");
    }
  }, [navigate]);

  if (orderBy === "menorPrecio") {
    sortedProducts.sort((a, b) => a.precio - b.precio);
  } else if (orderBy === "mayorPrecio") {
    sortedProducts.sort((a, b) => b.precio - a.precio);
  }

  useEffect(() => {
    setPage(1);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="product__list__container">
      <div className="products__container">
        <h1 className="products__title text-2xl font-normal">
          Estás en la siguiente categoría :{" "}
          <span className="font-semibold">
            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
          </span>
        </h1>

        <div>
          <div className="product__list__filters">
            <select
              onChange={handleSortChange}
              className="products__filter shadow-sm rounded-md py-1 px-2 w-56 text-center my-10 border border-gray-300"
              name="orderBy"
              id="orderBy"
              value={orderBy}
            >
              <option className="text-start cursor-pointer" value="">
                Ordenar por
              </option>
              <option className="text-start cursor-pointer" value="menorPrecio">
                Menor precio
              </option>
              <option className="text-start cursor-pointer" value="mayorPrecio">
                Mayor precio
              </option>
            </select>
            <PaginationCategory
              totalPage={totalPage}
              page={page}
              setPage={setPage}
              limit={limit}
              totalProducts={totalProducts}
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="products__cards__container">
              {sortedProducts?.map((product) => (
                <ProductCard
                  onClick={() => handleProductDetail(product?.id)}
                  key={product?.id}
                  className="products__card__allproducts shadow-md bg-white"
                >
                  <div className="products__card__img__container">
                    {user?.id === product?.vendedor_id ? (
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
                        {product?.precio
                          ? Number(product.precio).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })
                          : null}
                      </h6>
                    </div>
                  </div>
                </ProductCard>
              ))}
            </div>
          )}
        </div>
        <PaginationCategory
          totalPage={totalPage}
          page={page}
          setPage={setPage}
          limit={limit}
          totalProducts={totalProducts}
        />
      </div>
    </div>
  );
}

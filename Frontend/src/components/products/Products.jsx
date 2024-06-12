import { useContext, useEffect, useState } from "react";
import { ProductCard } from "../../components/productCard/ProductCard.jsx";
import { ProductContext } from "../../context/ProductContext.jsx";
import "../products/products.css";
import { useNavigate } from "react-router-dom";

export function Products() {
  const { products } = useContext(ProductContext);
  const [productById, setProductById] = useState(null);

  const navigate = useNavigate();

  const handleProductDetail = (id) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      setProductById(product);
    }
  };

  useEffect(() => {
    if (productById) {
      navigate(`/product/${productById.id}`);
    }
  }, [productById]);

  return (
    <div className="products__container">
      <h1 className="products__title text-2xl font-semibold">
        Productos recomendados
      </h1>
      <div className="products__cards__container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            className="products__card shadow-md bg-white"
          >
            <div onClick={() => handleProductDetail(product.id)}>
              <img
                className="products__card__img"
                src={product.href}
                alt={product.nombre}
              />
              <div className="products__card__desc__container px-4">
                <p className="products__card__paragraph text-slate-700 font-semibold text-lg">
                  {product.nombre}
                </p>
                <p className="products__card__paragraph font-semibold text-2xl">
                  {product.precio.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </p>
              </div>
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
}

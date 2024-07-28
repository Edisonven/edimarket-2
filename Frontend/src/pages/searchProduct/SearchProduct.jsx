import { useContext } from "react";
import "../searchProduct/searchProduct.css";
import { ProductContext } from "../../context/ProductContext";
import { ProductCard } from "../../components/productCard/ProductCard";
import { UserContext } from "../../context/UserContext";
import star from "/imgs/aplication/estrella.png";

export function SearchProduct() {
  const { findedProduct, handleProductDetail, searchProduct } =
    useContext(ProductContext);
  const { user } = useContext(UserContext);

  return (
    <section className="searchproduct__container">
      <h1 className="products__title text-2xl font-medium">
        Resultados de la búsqueda
      </h1>
      <span className="mt-2 text-sm font-medium text-slate-700">
        Palabra clave : <span>{searchProduct}</span>{" "}
      </span>
      <div className="products__cards__container">
        {findedProduct.length > 0 ? (
          findedProduct?.map((product) => (
            <ProductCard
              onClick={() => handleProductDetail(product?.producto_id)}
              key={product?.producto_id}
              product={product}
            />
          ))
        ) : (
          <div className="min-h-[420px]">
            <h1>No hay resultados para tu búsqueda</h1>
            <div className="flex flex-col mt-5">
              <ul className="flex flex-col gap-1">
                <li>Revisa la ortografía de lo que escribiste.</li>
                <li>Utiliza el nombre del producto que deseas buscar.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

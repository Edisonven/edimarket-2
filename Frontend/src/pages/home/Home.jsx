import "../home/home.css";
import { Products } from "../../components/products/Products.jsx";
import { Header } from "../../components/header/Header.jsx";
import { ProductsInOfert } from "../../components/productsInOfert/ProductsInOfert.jsx";

export function Home() {
  return (
    <section className="home__container">
      <Header />
      <Products />
      <ProductsInOfert />
    </section>
  );
}

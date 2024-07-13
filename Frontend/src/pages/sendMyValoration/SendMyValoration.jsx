import { useContext } from "react";
import "../sendMyValoration/sendMyValoration.css";
import { ProductContext } from "../../context/ProductContext";

export function SendMyValoration() {
  const { productToRate } = useContext(ProductContext);

  return (
    <section className="sendmyvaloration__container">
      <h1>Holi</h1>
    </section>
  );
}

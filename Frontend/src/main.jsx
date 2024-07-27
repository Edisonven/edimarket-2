import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CarritoContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CheckoutProvider } from "./context/CheckoutContext.jsx";
import { BillingProvider } from "./context/BillingContex.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
 /*  <React.StrictMode> */
    <BrowserRouter>
      <CheckoutProvider>
        <ProductProvider>
          <CartProvider>
            <UserProvider>
              <BillingProvider>
                <App />
              </BillingProvider>
            </UserProvider>
          </CartProvider>
        </ProductProvider>
      </CheckoutProvider>
    </BrowserRouter>
/*   </React.StrictMode> */
);

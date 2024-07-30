import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Home } from "./pages/home/Home.jsx";
import { SingUp } from "./pages/singUp/singUp.jsx";
import { SingIn } from "./pages/singIn/SingIn.jsx";
import { Navbar } from "./components/navbar/Navbar.jsx";
import { Footer } from "./components/footer/Footer.jsx";
import { ProductDetail } from "./pages/productDetail/ProductDetail.jsx";
import { CarritoModal } from "./components/carritoModal/CarritoModal.jsx";
import { ProductList } from "./pages/productList/ProductList.jsx";
import { Favorites } from "./pages/favorites/Favorites.jsx";
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "./context/UserContext.jsx";
import { MiPerfil } from "./pages/miPerfil/MiPerfil.jsx";
import { CreatePost } from "./pages/createPost/CreatePost.jsx";
import { Billing } from "./pages/billing/Billing";
import { PublishedProduct } from "./pages/publishedProduct/PublishedProduct.jsx";
import { Shipping } from "./pages/shipping/Shipping.jsx";
import { PaymentSuccess } from "./pages/paymentSuccess/PaymentSuccess.jsx";
import { ScrollTop } from "./components/scrollTop/ScrollTop.jsx";
import { UserData } from "./pages/userData/UserData.jsx";
import { EditUserData } from "./pages/editUserData/EditUserData.jsx";
import { UserAddress } from "./pages/userAddress/UserAddress.jsx";
import { AddUserAdress } from "./pages/addUserAddress/AddUserAddress.jsx";
import { NotFound } from "./pages/notFound/NotFound.jsx";
import { UserCards } from "./pages/userCards/UserCards.jsx";
import { AddUserCards } from "./pages/addUserCards/AddUserCards.jsx";
import { MyPosts } from "./pages/myPosts/MyPosts.jsx";
import { EditUserAddress } from "./pages/editUserAddress/EditUserAddress.jsx";
import { EditMyPost } from "./pages/editMyPost/EditMyPost.jsx";
import { SearchProduct } from "./pages/searchProduct/SearchProduct.jsx";
import { MyOrders } from "./pages/myOrders/MyOrders.jsx";
import { NoAddressAdded } from "./components/noAddressAdded/NoAddressAdded.jsx";
import { NoPaymentMethodsAdded } from "./components/noPaymentMethodsAdded/NoPaymentMethodsAdded.jsx";
import { MyQuestions } from "./pages/myQuestions/MyQuestions.jsx";
import { AllProducts } from "./pages/allProducts/AllProducts.jsx";
import { MyValorations } from "./pages/myValorations/MyValorations.jsx";
import { SendMyValoration } from "./pages/sendMyValoration/SendMyValoration.jsx";
import { UpdateMyValoration } from "./pages/myValorations/UpdateMyValoration.jsx";
import { FullCart } from "./components/fullCart/FullCart.jsx";

function App() {
  const { userToken, logout } = useContext(UserContext);
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/not-found") {
      if (navbarRef.current) {
        navbarRef.current.style.display = "none";
      }
    } else {
      if (navbarRef.current) {
        navbarRef.current.style.display = "";
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar navbarRef={navbarRef} />
      <ScrollTop />
      <section className="app__container">
        <Routes>
          <Route
            path="/carro"
            element={userToken ? <FullCart /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/billing"
            element={userToken ? <Billing /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/compra-exitosa"
            element={
              userToken ? <PaymentSuccess /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/myProduct"
            element={
              userToken ? <PublishedProduct /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="shipping"
            element={userToken ? <Shipping /> : <Navigate to="/sign-in" />}
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/"
            element={userToken ? <Home /> : <Navigate to="/sign-in" />}
          />
          <Route path="/sign-up" element={<SingUp />} />
          <Route
            path="/sign-in"
            element={userToken ? <Navigate to="/" /> : <SingIn />}
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/category/:categoria" element={<ProductList />} />
          <Route path="/product-name/:name" element={<SearchProduct />} />
          <Route
            path="/favorites"
            element={userToken ? <Favorites /> : <Navigate to="/sign-in" />}
          />{" "}
          <Route
            path="/miperfil"
            element={userToken ? <MiPerfil /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/createpost"
            element={userToken ? <CreatePost /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/user-data"
            element={userToken ? <UserData /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/edit-user-data"
            element={userToken ? <EditUserData /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/my-posts"
            element={userToken ? <MyPosts /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/edit-post/:id"
            element={userToken ? <EditMyPost /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/user-address"
            element={userToken ? <UserAddress /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/add-address"
            element={userToken ? <AddUserAdress /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/edit-address"
            element={
              userToken ? <EditUserAddress /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/my-credit-cards"
            element={userToken ? <UserCards /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/add-credit-cards"
            element={userToken ? <AddUserCards /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/my-orders"
            element={userToken ? <MyOrders /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/no-address-added"
            element={
              userToken ? <NoAddressAdded /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/no-payment-added"
            element={
              userToken ? <NoPaymentMethodsAdded /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/my-questions"
            element={userToken ? <MyQuestions /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/my-valorations/*"
            element={userToken ? <MyValorations /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/send-my-valoration"
            element={
              userToken ? <SendMyValoration /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/edit-my-valoration/:productId"
            element={
              userToken ? <UpdateMyValoration /> : <Navigate to="/sign-in" />
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>

        <Footer />
        <CarritoModal />
      </section>
    </>
  );
}

export default App;

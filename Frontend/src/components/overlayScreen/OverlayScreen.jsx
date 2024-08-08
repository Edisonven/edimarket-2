import { useContext, useEffect, useRef } from "react";
import "../overlayScreen/overlayScreen.css";
import { CartContext } from "../../context/CartContext";

export function OverlayScreen({ clicked }) {
  const { cartModal } = useContext(CartContext);

  const overlayRef = useRef(null);

  useEffect(() => {
    if (cartModal || clicked) {
      document.body.style.overflowY = "hidden";
      overlayRef.current.classList.remove("overlayNone");
      overlayRef.current.classList.add("overlayVisible");
    } else {
      document.body.style.overflowY = "auto";
      overlayRef.current.classList.add("overlayNone");
      overlayRef.current.classList.remove("overlayVisible");
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [cartModal, clicked]);

  return <div ref={overlayRef} className="overlay overlayNone"></div>;
}

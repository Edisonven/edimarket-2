import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handleDefaultCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleAddressChange = (id) => {
    setSelectedAddress(id);
  };

  const handlePickupChange = () => {
    setSelectedAddress("pickup");
  };

  const handleCheckboxChange = () => {
    setSelectedPaymentMethod("webpay");
  };

  const handleEfectivoChange = () => {
    setSelectedPaymentMethod("efectivo");
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        handleAddressChange,
        handlePickupChange,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        handleCheckboxChange,
        handleDefaultCheckboxChange,
        handleEfectivoChange,
        isLoading,
        setIsLoading,
        navigate,
        capitalizeFirstLetter,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

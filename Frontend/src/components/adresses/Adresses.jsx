import { useContext, useEffect } from "react";
import classNames from "classnames";
import shipping from "/src/pages/shipping/shipping.module.css";
import { UserContext } from "../../context/UserContext";
import { CheckoutContext } from "../../context/CheckoutContext";
import config from "../../config/config";

export function Adresses() {
  const {
    selectedAddress,
    handleAddressChange,
    handlePickupChange,
    capitalizeFirstLetter,
  } = useContext(CheckoutContext);
  const { userAddress, setUserAddress, userToken, userData } =
    useContext(UserContext);

  useEffect(() => {
    const handleUserAddress = async () => {
      try {
        if (userToken) {
          const response = await fetch(
            `${config.backendUrl}/usuarios/usuario/domicilio?idUsuario=${userData.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al obtener domicilio");
          }

          const data = await response.json();
          setUserAddress(data.Domicilio);

          return data;
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    handleUserAddress();
  }, [userToken, userData.id, setUserAddress]);

  return (
    <div className="">
      <div
        className={classNames(
          "p-4",
          shipping.shipping_box,
          shipping.delivery_type_container_pickup,
          shipping.delivery
        )}
      >
        <h2 className="mb-[15px]">Retira tu compra</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="pickup"
            checked={selectedAddress === "pickup"}
            onChange={handlePickupChange}
            className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
          />
          <label htmlFor="pickup">Retira en tu punto más cercano</label>
        </div>
      </div>
      <div
        className={classNames(
          "mt-10",
          "p-4",
          shipping.shipping_box,
          shipping.delivery_type_container,
          shipping.delivery
        )}
      >
        <h2>Despacho a domicilio</h2>
        {userAddress.map((address) => (
          <div
            key={address.id}
            className={classNames(
              shipping.delivery_type_container,
              shipping.delivery
            )}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`address-${address.id}`}
                checked={selectedAddress === address.id}
                onChange={() => handleAddressChange(address.id)}
                className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <label htmlFor={`address-${address.id}`}>
                <p>
                  {capitalizeFirstLetter(address.direccion)},{" "}
                  {capitalizeFirstLetter(address.comuna)},{" "}
                  {capitalizeFirstLetter(address.region)}
                </p>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

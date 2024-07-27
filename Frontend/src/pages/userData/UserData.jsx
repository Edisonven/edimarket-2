import { useNavigate } from "react-router-dom";
import "../userData/userData.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { ProductContext } from "../../context/ProductContext";
import { Loader } from "../../components/loader/Loader";

export function UserData() {
  const { user } = useContext(UserContext);
  const { loading } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleNavigateToEdit = () => {
    navigate("/edit-user-data");
  };

  return (
    <section className="personaldata__container">
      <h1 className="text-2xl font-semibold mb-5">Datos personales</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="personaldata__body flex flex-col gap-2 bg-white shadow-sm rounded-md p-[25px]">
          <hr />
          <div className="personaldata__name flex items-center justify-between my-5">
            <div className="flex items-center gap-10 flex-wrap w-full">
              <div className="flex flex-col">
                <p className="font-semibold mb-1 text-lg">Nombre y apellido</p>
                <p className="text-sm">{user?.nombre}</p>
              </div>
            </div>
          </div>
          <div className="personaldata__email flex items-center justify-between my-5">
            <div className="flex items-center gap-10 flex-wrap w-full">
              <div className="flex flex-col">
                <p className="font-semibold mb-1 text-lg">Email</p>
                <p className="text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="personaldata__email flex items-center justify-between my-5">
            <div className="flex items-center gap-10 flex-wrap w-full">
              <div className="flex flex-col">
                <p className="font-semibold mb-1 text-lg">Contraseña</p>
                <p className="text-sm">{"*".repeat(Math.min(10, 10))}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex items-center justify-end w-full mt-5">
            <button
              onClick={handleNavigateToEdit}
              className="edit__btn font-semibold  text-teal-500"
            >
              Modificar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

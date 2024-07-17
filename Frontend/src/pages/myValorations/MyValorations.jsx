import { useContext, useState } from "react";
import "../myValorations/myValorations.css";
import { UserContext } from "../../context/UserContext";
import { ProductContext } from "../../context/ProductContext";
import { Loader } from "../../components/loader/Loader";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { Pending } from "./Pending.jsx";
import { Completed } from "./Completed.jsx";

export function MyValorations() {
  const { orders } = useContext(UserContext);
  const { loading } = useContext(ProductContext);

  return (
    <section className="myvalorations__container">
      <h1 className="text-2xl font-semibold mb-5">Mis valoraciones</h1>

      <div className="mb-4 flex items-center gap-4">
        <NavLink
          to="pending"
          className={`${({ isActive }) =>
            isActive ? "active" : ""} font-semibold text-lg relative`}
        >
          Pendientes
        </NavLink>
        <NavLink
          to="completed"
          className={`${({ isActive }) =>
            isActive ? "active" : ""} font-semibold text-lg relative`}
        >
          Realizadas
        </NavLink>
      </div>
      <div className="myvalorations__body bg-white shadow-sm rounded-md p-3 h-[480px]">
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="pending" />} />
            <Route path="pending" element={<Pending orders={orders} />} />
            <Route path="completed" element={<Completed orders={orders} />} />
          </Routes>
        )}
      </div>
    </section>
  );
}

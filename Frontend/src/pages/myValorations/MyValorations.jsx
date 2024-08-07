import "../myValorations/myValorations.css";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { Pending } from "./Pending.jsx";
import { Completed } from "./Completed.jsx";

export function MyValorations() {
  return (
    <section className="myvalorations__container">
      <h1 className="text-2xl font-semibold mb-5">Mis valoraciones</h1>
      <div className="mb-4 flex items-center gap-6">
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
      <div className="myvalorations__body bg-white shadow-sm rounded-md p-5">
        <Routes>
          <Route path="/" element={<Navigate to="pending" />} />
          <Route path="pending" element={<Pending />} />
          <Route path="completed" element={<Completed />} />
        </Routes>
      </div>
    </section>
  );
}

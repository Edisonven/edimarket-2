import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation } from "react-router-dom";

export function PendingPagination({
  className,
  page,
  setPage,
  total,
  limit,
  setOrderBy,
}) {
  const totalPages = Math.ceil(total / limit);
  const location = useLocation();

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOrderBy("fecha_venta-desc");
  }, [page]);

  useEffect(() => {
    if (location.pathname !== "/my-valorations/pending") {
      setPage(1);
    }
  }, [location.pathname]);

  return (
    <section className={className}>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          className={`page-item ${
            page === 1 ? "hidden" : ""
          } flex items-center hover:bg-slate-200 py-1 px-2 rounded transition duration-300 select-none`}
        >
          <IoIosArrowBack />
          Anterior
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <div
            key={index}
            className={`page-item ${
              page === index + 1 ? "bg-teal-300 rounded-full" : ""
            } cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 transition duration-300 select-none`}
            onClick={() => setPage(index + 1)}
          >
            <div className="page-link" href="#">
              {index + 1}
            </div>
          </div>
        ))}

        <button
          onClick={handleNext}
          className={`page-item ${
            page === totalPages ? "disabled" : ""
          } flex items-center hover:bg-slate-200 py-1 px-2 rounded transition duration-300 select-none`}
        >
          Siguiente
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}

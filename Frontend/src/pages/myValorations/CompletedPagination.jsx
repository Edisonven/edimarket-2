import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation } from "react-router-dom";

export function CompletedPagination({
  className,
  pageValorate,
  setPageValorate,
  totalPageValorate,
  limitValorate,
  setOrderByValorate,
}) {
  const totalPages = Math.ceil(totalPageValorate / limitValorate);
  const location = useLocation();

  const handleNext = () => {
    if (pageValorate < totalPages) {
      setPageValorate(pageValorate + 1);
    }
  };

  const handlePrev = () => {
    if (pageValorate > 1) {
      setPageValorate(pageValorate - 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOrderByValorate("fecha_venta-desc");
  }, [pageValorate]);

  useEffect(() => {
    if (location.pathname !== "/my-valorations/completed") {
      setPageValorate(1);
    }
  }, [location.pathname]);

  return (
    <section className={className}>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          className={`page-item ${
            pageValorate === 1 ? "hidden" : ""
          } flex items-center hover:bg-slate-200 py-1 px-2 rounded transition duration-300 select-none`}
        >
          <IoIosArrowBack />
          Anterior
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <div
            key={index}
            className={`page-item ${
              pageValorate === index + 1 ? "bg-teal-300 rounded-full" : ""
            } cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 transition duration-300 select-none`}
            onClick={() => setPageValorate(index + 1)}
          >
            <div className="page-link" href="#">
              {index + 1}
            </div>
          </div>
        ))}

        <button
          onClick={handleNext}
          className={`page-item ${
            pageValorate === totalPages ? "disabled" : ""
          } flex items-center hover:bg-slate-200 py-1 px-2 rounded transition duration-300 select-none`}
        >
          Siguiente
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}

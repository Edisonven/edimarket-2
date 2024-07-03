import { useContext } from "react";
import "../pagination/pagination.css";
import {
  TbChevronRightPipe,
  TbChevronLeftPipe,
  TbChevronRight,
  TbChevronLeft,
} from "react-icons/tb";
import { ProductContext } from "../../context/ProductContext";

export function Pagination() {
  const { totalPage, page, setPage, limit, totalProducts } =
    useContext(ProductContext);

  const totalPages = Math.ceil(totalProducts / limit);

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

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalProducts);

  return (
    <section className="pagination__container">
      <hr className="" />
      <div className="flex flex-col sm:flex-row items-center mt-2 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm">
            Items por página: <span className="font-medium">{totalPage}</span>{" "}
          </span>
          <span className="text-sm">
            {startItem}-{endItem} de {totalProducts}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <TbChevronLeftPipe
            onClick={handleFirstPage}
            className={`pagination__arrow pagination__arrow__first ${
              page === 1 ? "text-gray-400 hover:bg-none" : ""
            }`}
          />
          <TbChevronLeft
            onClick={handlePrev}
            className={`pagination__arrow pagination__arrow__prev ${
              page === 1 ? "text-gray-400" : ""
            }`}
          />
          <span className="font-medium">{page}</span>
          <TbChevronRight
            onClick={handleNext}
            className={`pagination__arrow pagination__arrow__next ${
              page === totalPages ? "text-gray-400 hover:bg-none" : ""
            }`}
          />
          <TbChevronRightPipe
            onClick={handleLastPage}
            className={`pagination__arrow pagination__arrow__last ${
              page === totalPages ? "text-gray-400 hover:bg-none" : ""
            }`}
          />
        </div>
      </div>
    </section>
  );
}

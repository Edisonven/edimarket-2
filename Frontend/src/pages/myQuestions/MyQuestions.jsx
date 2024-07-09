import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import "../myQuestions/myQuestions.css";
import { UserContext } from "../../context/UserContext";
import { ProductContext } from "../../context/ProductContext";
import { HiDotsVertical } from "react-icons/hi";
import { QuestionModal } from "../../components/questionModal/QuestionModal";

const DeleteIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <HiDotsVertical {...props} />
  </div>
));

export function MyQuestions() {
  const { user, userToken } = useContext(UserContext);
  const { loading, setLoading } = useContext(ProductContext);
  const [product, setProduct] = useState([]);
  const [productId, setProductId] = useState("");
  const iconRef = useRef(null);
  const modalRef = useRef(null);

  const handleGetProductWithQuestions = async () => {
    try {
      if (userToken) {
        const response = await fetch(
          `http://localhost:3000/productos/producto/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al obtener productos con preguntas"
          );
        }
        const data = await response.json();
        setProduct(data.productos);
        return data;
      } else {
        return;
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProductWithQuestions();
  }, []);

  const handleOpenModal = (id) => {
    setProductId(id);
    if (productId) {
      setProductId("");
    }
  };

  const handleClickOutside = (e) => {
    if (
      modalRef.current &&
      iconRef.current &&
      !modalRef.current.contains(e.target) &&
      !iconRef.current.contains(e.target)
    ) {
      setProductId("");
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="myquestions___container bg-white shadow-sm rounded-sm">
      <h1 className="text-2xl font-semibold mb-5">Mis preguntas realizadas</h1>
      <div className="myquestions__body flex flex-col gap-5">
        {product.length > 0 ? (
          product.map((element) => {
            return (
              <div
                className="border p-4 rounded-md shadow-sm"
                key={element?.producto_id}
              >
                <div className="flex items-center gap-2 relative">
                  <div className="border p-2 rounded-md shadow">
                    <img
                      className="w-[80px] object-cover "
                      src={element?.imagen}
                      alt=""
                    />
                  </div>
                  <div className="flex items-center justify-between w-full overflow-hidden h-[40px]">
                    <p className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px] md:max-w-full ">
                      {element?.titulo}
                    </p>
                    <DeleteIcon
                      ref={element?.producto_id === productId ? iconRef : null}
                      onClick={() => handleOpenModal(element?.producto_id)}
                      className="cursor-pointer scale-[2] select-none hover:bg-slate-200 rounded-full mr-3 p-[3px]"
                    />
                    {element?.producto_id === productId ? (
                      <QuestionModal
                        handleGetProductWithQuestions={
                          handleGetProductWithQuestions
                        }
                        setProductId={setProductId}
                        productId={productId}
                        confirmProductId={element?.producto_id}
                        ref={modalRef}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <hr className="my-4" />
                <div className="flex flex-col gap-2">
                  {element?.preguntas.map((pregunta) => {
                    return (
                      <div
                        key={pregunta?.id_pregunta}
                        className="flex items-center gap-3 ml-3 font-medium overflow-hidden"
                      >
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px] sm:max-w-full">
                          • {pregunta?.pregunta}
                        </p>
                        <span className="text-sm text-gray-500">
                          {pregunta?.fecha}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-6">
            <h3>No has hecho preguntas aún.</h3>
            <p>Cuando hagas rpeguntas en algún producto aparecerán acá.</p>
          </div>
        )}
      </div>
    </section>
  );
}

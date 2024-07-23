import { forwardRef, useContext, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { ConfirmDelete } from "../confirmDelete/ConfirmDelete";
import { IoIosClose } from "react-icons/io";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import { ProductContext } from "../../context/ProductContext";

const ModalIcon = forwardRef((props, ref) => (
  <div ref={ref}>
    <IoIosClose {...props} />
  </div>
));

export const QuestionModal = forwardRef(
  (
    {
      productId,
      setProductId,
      handleGetProductWithQuestions,
      setQuestionsDeleted,
    },
    ref
  ) => {
    const { userToken, user } = useContext(UserContext);
    const { setLoading, loading } = useContext(ProductContext);
    const modalRef = useRef(null);
    const iconRef = useRef(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState("");

    const handleDeleteQuestions = async () => {
      try {
        const response = await fetch(
          `https://backend-mu-three-82.vercel.app/usuarios/preguntas/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ id: user?.id }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar preguntas");
        }

        const data = await response.json();
        handleGetProductWithQuestions();
        setQuestionsDeleted("Preguntas eliminadas.");
        setTimeout(() => {
          setQuestionsDeleted("");
        }, 3000);
        return data;
      } catch (error) {
        console.error("Error:", error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    const handleConfirmDeleteQuestions = (productId) => {
      if (productId) {
        handleDeleteQuestions();
        setProductId("");
      }
    };

    const handleOpenConfirmModal = (id) => {
      if (id) {
        setConfirmDeleteId(id);
      }
    };

    return (
      <div
        ref={ref}
        className="questionmodal__container absolute top-[70px] right-[45px] border flex justify-center flex-col gap-2 z-50 rounded-md shadow bg-gray-100 overflow-hidden"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${confirmDeleteId ? "hidden" : ""}`}
        >
          <p
            onClick={() => handleOpenConfirmModal(productId)}
            className="hover:bg-teal-200 rounded-sm cursor-pointer py-[10px] px-3 text-sm font-medium select-none"
          >
            Eliminar preguntas
          </p>
          <p className="hover:bg-teal-200 rounded-sm cursor-pointer py-[10px] px-3 text-sm font-medium select-none">
            Reportar preguntas
          </p>
        </div>
        {confirmDeleteId ? (
          <ConfirmDelete
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className="confirm__delete__modal__card bg-gray-100 shadow-sm p-3 rounded-md flex flex-col items-stretch gap-4 border cursor-default"
          >
            <ModalIcon
              ref={iconRef}
              onClick={() => {
                setProductId("");
              }}
              className="close__icon"
            />
            <h2 className="text-center">Eliminar preguntas</h2>
            <hr />
            <span className="text-center font-medium text-sm">
              ¿Seguro que quieres eliminar las preguntas?
            </span>
            <hr />
            <div className="flex items-center justify-evenly">
              <GeneralBtn
                onClick={() => {
                  setProductId("");
                }}
                type="primary"
                className="confirm__delete__btn"
              >
                Cancelar
              </GeneralBtn>
              <GeneralBtn
                onClick={() => handleConfirmDeleteQuestions(productId)}
                type="primary"
                className="confirm__delete__btn"
              >
                Eliminar
              </GeneralBtn>
            </div>
          </ConfirmDelete>
        ) : (
          ""
        )}
      </div>
    );
  }
);

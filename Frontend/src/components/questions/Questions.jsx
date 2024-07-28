import "../questions/questions.css";
import { GeneralBtn } from "../generalBtn/GeneralBtn";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { CartAlert } from "../cartAlert/CartAlert";
import config from "../../config/config";

export function Questions({ vendedor_id }) {
  const {
    questionsByProductId,
    handleGetQuestionsByProductId,
    setLoading,
    loading,
  } = useContext(ProductContext);
  const {
    userData,
    inputFormError,
    setInputFormError,
    setUserData,
    initialUserData,
    handleChange,
    inputRefs,
    userToken,
    user,
    questionsByUser,
  } = useContext(UserContext);
  const respuesta = "";
  const { id } = useParams();
  const [questionsByOtherUsers, setQuestionsByOtherUsers] = useState("");
  const [sendQuestionSuccess, setSendQuestionSucces] = useState({
    success: "",
    error: "",
  });

  const handleSendQuestion = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/usuarios/preguntas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          idProducto: id,
          pregunta: userData.preguntas,
        }),
      });

      if (!response) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar tu pregunta");
      }

      const data = await response.json();
      handleGetQuestionsByProductId();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    setInputFormError({
      errorPreguntas: "",
    });

    if (userData.preguntas.trim() === "") {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPreguntas: "Ingresa una pregunta",
      }));
    } else if (userData.preguntas.trim().length < 5) {
      setInputFormError((prevErrors) => ({
        ...prevErrors,
        errorPreguntas: "Ingresa mínimo 5 caracteres",
      }));
    } else {
      try {
        const res = await handleSendQuestion();
        setUserData(initialUserData);
        setSendQuestionSucces((prevData) => ({
          ...prevData,
          success: "¡Pregunta enviada!",
        }));

        inputRefs.timeoutRef.current = setTimeout(() => {
          setSendQuestionSucces((prevState) => ({
            ...prevState,
            success: "",
          }));
          inputRefs.timeoutRef.current = null;
        }, 3000);
      } catch (error) {
        console.error(error.message || "Error al enviar pregunta");
        setSendQuestionSucces((prevData) => ({
          ...prevData,
          error: "No pudimos enviar tu pregunta.",
        }));

        inputRefs.timeoutRef.current = setTimeout(() => {
          setSendQuestionSucces((prevState) => ({
            ...prevState,
            error: "",
          }));
          inputRefs.timeoutRef.current = null;
        }, 3000);
        throw error;
      }
    }
  };

  const questionsFiltered = questionsByProductId.filter(
    (question) => question.usuario_id === user?.id
  );

  useEffect(() => {
    const questionsByUserNotIncluded = questionsByProductId.some(
      (product) => product?.usuario_id !== user?.id
    );
    const questionsByUserIncluded = questionsByProductId.some(
      (product) => product?.usuario_id === user?.id
    );

    if (questionsByUser !== 0 && !questionsByUserNotIncluded) {
      setQuestionsByOtherUsers("No hay preguntas hechas por otros usuarios.");
    } else if (questionsByUser !== 0 && questionsByUserIncluded) {
      setQuestionsByOtherUsers("");
    }
  }, [questionsByProductId]);

  const questionFinded = questionsByProductId.find(
    (question) => question?.usuario_id !== user?.id
  );

  return (
    <section className="questions__container">
      <h1 className="text-2xl mt-5">Preguntas</h1>
      <div className="">
        <div className="questions__body __container w-full">
          {vendedor_id === user?.id && userToken ? (
            ""
          ) : (
            <form
              onSubmit={handleSubmitQuestion}
              className="questions__form__container mt-7"
            >
              <div className="questions__input__body flex flex-col gap-5 md:flex-row items-start">
                <div className="w-full">
                  <input
                    ref={inputRefs.preguntasRef}
                    onChange={handleChange}
                    value={userData.preguntas}
                    name="preguntas"
                    className={`input w-full  ${
                      inputFormError.errorPreguntas
                        ? "focus: outline-2 outline outline-red-600"
                        : "focus: outline-2 outline-green-300"
                    }`}
                    type="text"
                    placeholder="Haz una pregunta..."
                  />
                  {inputFormError.errorPreguntas ? (
                    <p className="text-red-600 font-semibold text-sm ml-3">
                      {inputFormError.errorPreguntas}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <GeneralBtn
                  className="w-full h-12 flex items-center justify-center md:w-1/3"
                  type="secondary"
                >
                  Enviar
                </GeneralBtn>
              </div>
            </form>
          )}
        </div>

        <div>
          {questionsByProductId.length > 0 ? (
            <div className="ml-5 questions__body mt-10 h-full">
              {user?.id && questionsFiltered?.length > 0 ? (
                <div>
                  <h3 className="mb-3 font-semibold">Tus preguntas</h3>
                  <div className="bg-gray-100 p-3 rounded-md flex flex-col gap-5">
                    {questionsByProductId.map((pregunta) => {
                      return pregunta?.usuario_id === user?.id ? (
                        <div key={pregunta?.id} className="">
                          <div className="flex items-center justify-between relative">
                            <div>
                              <p className="">{pregunta?.pregunta}</p>
                            </div>
                          </div>
                          {respuesta ? (
                            <div className="flex items-center gap-3">
                              <p className="ml-3 text-sm text-gray-400 font-medium">
                                Sí
                              </p>
                              <p className="text-sm text-gray-400 font-medium">
                                05/07/2024
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 font-medium ml-3">
                              Esperando respuesta del vendedor...
                            </p>
                          )}
                        </div>
                      ) : (
                        ""
                      );
                    })}
                  </div>
                </div>
              ) : (
                ""
              )}
              <h3 className="mb-3 font-semibold mt-6">Últimas hechas</h3>
              {questionsByProductId.map((pregunta) => {
                return pregunta?.usuario_id !== user?.id ? (
                  <div key={pregunta?.id}>
                    <div className="mb-5">
                      <div className="flex items-center justify-between mt-2 relative">
                        <div>
                          <p className="">{pregunta?.pregunta}</p>
                        </div>
                      </div>
                      {respuesta ? (
                        <div className="flex items-center gap-3">
                          <p className="ml-3 text-sm text-gray-400">Sí</p>
                          <p className="text-sm text-gray-400">05/07/2024</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400  ml-3">
                          Esperando respuesta del vendedor...
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                );
              })}
              {!questionFinded ? <p>{questionsByOtherUsers}</p> : ""}
            </div>
          ) : (
            <div className="flex justify-center mt-10 flex-col ml-5">
              <h3 className="mb-3 font-semibold mt-6">Últimas hechas</h3>
              <p>Aún no han hecho preguntas sobre este producto.</p>
            </div>
          )}
        </div>
      </div>
      {sendQuestionSuccess.success && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-green-600">
            {sendQuestionSuccess.success}
          </p>
        </CartAlert>
      )}
      {sendQuestionSuccess.error && (
        <CartAlert>
          <p className="card__perfil__alert shadow-md rounded-md bg-red-600">
            {sendQuestionSuccess.error}
          </p>
        </CartAlert>
      )}
    </section>
  );
}

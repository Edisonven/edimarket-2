import pkg from "transbank-sdk";
const {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  Environment,
  IntegrationCommerceCodes,
} = pkg;

const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

const sendTransactionCreated = async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;

    const createResponse = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    res.json(createResponse);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send("Error creating transaction");
  }
};

const confirmTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body;
    if (!token_ws) {
      return res.status(400).json({ message: "Token no proporcionado" });
    }

    const response = await tx.commit(token_ws);

    if (response.response_code === 0 && response.status === "AUTHORIZED") {
      return res.json({ status: "AUTHORIZED", data: response });
    } else if (response.response_code === -1 && response.status === "FAILED") {
      return res.json({ status: "TRANSACTION FAILED" });
    } else {
      return res.json({ status: "NOT_AUTHORIZED" });
    }
  } catch (error) {
    console.error("Error al confirmar la transacción:", error);

    res.status(500).json({
      message: error.message || "Error desconocido",
    });
  }
};

export const webPayPlusController = {
  sendTransactionCreated,
  confirmTransaction,
};

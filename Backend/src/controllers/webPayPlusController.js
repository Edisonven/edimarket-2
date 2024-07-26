import pkg from "transbank-sdk";
const {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  Environment,
  IntegrationCommerceCodes,
} = pkg;

WebpayPlus.commerceCode = 597055555532;
WebpayPlus.apiKey =
  "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
WebpayPlus.environment = Environment.Integration;

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

export const webPayPlusController = {
  sendTransactionCreated,
};

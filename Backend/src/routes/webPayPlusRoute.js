import { Router } from "express";

const router = Router();

import { webPayPlusController } from "../controllers/webPayPlusController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.post("/transaction", verificarToken,webPayPlusController.sendTransactionCreated)


export default router;

import { Router } from "express";
const router = Router();

import { productController } from "../controllers/productController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.post("/", verificarToken, productController.ventaRealizada);
router.post("/valorar", verificarToken, productController.valorarProducto);

export default router;

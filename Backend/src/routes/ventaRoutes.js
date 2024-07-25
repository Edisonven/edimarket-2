import { Router } from "express";
const router = Router();

import { productController } from "../controllers/productController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.post("/", verificarToken, productController.ventaRealizada);
router.post("/valorar", verificarToken, productController.valorarProducto);
router.put("/valorar", verificarToken, productController.actualizarProductoValorado);
router.post("/calificar", verificarToken, productController.sendCalificationOfValorate);
router.get("/calificar/:productId",  productController.getCalificationOfValorate);
router.patch("/calificar", verificarToken, productController.updateCalificationOfValorate);

export default router;

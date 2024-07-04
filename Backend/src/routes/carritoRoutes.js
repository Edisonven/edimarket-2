import { Router } from "express";
const router = Router();

import { productController } from "../controllers/productController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.post("/", verificarToken, productController.añadirProductoCarrito);
router.get("/", verificarToken, productController.getCarrito);
router.delete(
  "/:idProducto",
  verificarToken,
  productController.deleteProductoCarrito
);

export default router;

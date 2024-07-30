import { Router } from "express";
const router = Router();

import { cartController } from "../controllers/cartController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.post("/", verificarToken, cartController.añadirProductoCarrito);
router.get("/", verificarToken, cartController.getCarrito);
router.delete("/:idProducto",verificarToken,cartController.deleteProductoCarrito);
router.patch("/update-quantity", verificarToken, cartController.modifyQuantityOfProductAdded);

export default router;

import { Router } from "express";
import multer from "multer";
import { productImgController } from "../controllers/productImgController.js";
import verificarToken from "../middlewares/verificarToken.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/img/single",upload.single("productImg"),verificarToken, productImgController.sendLocalImg);

export default router;

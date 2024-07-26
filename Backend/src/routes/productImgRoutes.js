import { Router } from "express";
import multer from "multer";
import { productImgController } from "../controllers/productImgController.js";
import verificarToken from "../middlewares/verificarToken.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/img/single",upload.single("productImg"),verificarToken, productImgController.sendLocalImg);
router.post("/img/multi",upload.array("pictures",10),verificarToken, productImgController.sendMultiImgs);

export default router;

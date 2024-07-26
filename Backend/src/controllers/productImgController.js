import fs from "node:fs";

const sendLocalImg = async (req, res) => {
  try {
    const newPath = saveImg(req.file);
    res.send(`Imagen subida: ${newPath}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir la imagen");
  }
};

const saveImg = (file) => {
  const newPath = path.resolve(uploadDir, file.originalname);
  fs.renameSync(file.path, newPath);
  return newPath;
};

const sendMultiImgs = async (req, res) => {
  try {
    req.files.map(saveImg);
    res.send("Imágenes subidas");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir las imágenes");
  }
};

export const productImgController = {
  sendLocalImg,
  sendMultiImgs,
};

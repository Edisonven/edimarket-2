import fs from "node:fs";

const sendLocalImg = async (req, res) => {
  console.log(req.file);
  saveImg(req.file);
  res.send("holi");
};

const saveImg = (file) => {
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
};

const sendMultiImgs = async (req, res) => {
  req.files.map(saveImg);
  res.send("imágenes subidas");
};

export const productImgController = {
  sendLocalImg,
  sendMultiImgs,
};

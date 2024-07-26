import fs from "node:fs";

const sendLocalImg = (req, res) => {
  console.log(req.file);
  saveImg(req.file);
  res.send("holi ");
};

const saveImg = (file) => {
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
};

export const productImgController = {
  sendLocalImg,
};

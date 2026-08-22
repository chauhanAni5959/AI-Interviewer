import fs from "fs";
import multer from "multer";
// fs is for checking if the folder is empty or not
const uploadPath = "../uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// creating storage for files upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, //20gb
  },
});

export default upload;

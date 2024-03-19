import { mkdirSync } from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const {
      params: { uid },
    } = req;
    const { fieldname } = file;

    let folderPath;
    switch (fieldname) {
      case "document":
        folderPath = `./src/public/uploads/${uid}/documents`;
        break;
      case "profile":
        folderPath = `./src/public/uploads/${uid}/profiles`;
        break;
      case "product":
        folderPath = `./src/public/uploads/${uid}/products`;
        break;
      default:
        return callback(new Error("Invalid upload"), false);
    }
    mkdirSync(folderPath, { recursive: true });
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const {
      params: { uid },
    } = req;
    const nameFile = `${Date.now()}-${uid}-${file.originalname}`;
    callback(null, nameFile);
  },
});

export const uploadDocument = multer({
  storage,
});

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../Frontend/public/img/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single("image");

export const handleUpload = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imagePath = `/img/uploads/${req.file.filename}`;
    res.status(200).json({ message: "Upload success", image: req.file.filename, imagePath });
  } catch (error) {
    console.error("Error en handleUpload:", error);
    res.status(500).json({ error: "Error interno", details: error.message });
  }
};
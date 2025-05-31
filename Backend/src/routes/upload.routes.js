import { Router } from "express";
import { uploadMiddleware, handleUpload } from "../controllers/upload.controller.js";
import { uploadCardMiddleware, handleCardUpload } from "../controllers/uploadCards.controller.js";

const router = Router();

// POST /upload/profile
router.post("/upload", uploadMiddleware, handleUpload);
router.post("/card", uploadCardMiddleware, handleCardUpload);

export default router;
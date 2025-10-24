import express from "express";
import multer from "multer";
import { parseFile } from "../utils/parseFile.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("File received:", req.file);

    const text = await parseFile(req.file);
    res.json({ text });
  } catch (err) {
    console.error("Error parsing file:", err);
    res.status(500).json({ error: "Failed to extract text." });
  }
});


export default router;

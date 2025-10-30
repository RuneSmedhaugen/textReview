import express from "express";
import multer from "multer";
import { parseFile } from "../utils/parseFile.js";
import { summarizeText } from "../ai.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const text = await parseFile(req.file);
    const summary = await summarizeText(text);
    res.json({ text, summary });
  } catch (err) {
    console.error("Error parsing file:", err);
    res.status(500).json({ error: "Failed to extract text." });
  }
});


export default router;

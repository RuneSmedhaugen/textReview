import express from "express";
import multer from "multer";
import { parseFile } from "../utils/parseFile.js";
import { summarizeText } from "../ai.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


// Existing upload route (no type)
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


router.post("/upload-and-summarize", upload.single("file"), async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    if (!type || typeof type !== "string") {
      return res.status(400).json({ error: "Document type is required." });
    }
    const validTypes = ["CV", "essay", "report", "article", "business email", "generic text"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid document type." });
    }
    const text = await parseFile(req.file);
    const summary = await summarizeText(text, type);
    res.json({ summary });
  } catch (err) {
    console.error("Error in upload-and-summarize:", err);
    res.status(500).json({ error: "Failed to process and summarize file." });
  }
});


export default router;

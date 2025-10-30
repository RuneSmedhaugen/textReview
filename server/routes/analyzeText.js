import express from "express";
import { summarizeText } from "../ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await summarizeText(text, type);

    res.json({ text, summary });
  } catch (err) {
    console.error("Error summarizing text:", err);
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

export default router;

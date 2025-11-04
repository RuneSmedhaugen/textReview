
import express from "express";
import { summarizeText } from "../ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { text, type } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }
    // Normalize type: if empty, undefined, or not a known type, use 'generic text'
    const validTypes = ["CV", "essay", "report", "article", "business email", "generic text"];
    if (!type || typeof type !== "string" || !validTypes.includes(type)) {
      console.warn(`Received invalid or empty type: '${type}', defaulting to 'generic text'.`);
      type = "generic text";
    }
    console.log(`Received summarize request for type: '${type}'`);
    const summary = await summarizeText(text, type);
    res.json({ text, summary });
  } catch (err) {
    console.error("Error summarizing text:", err);
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

export default router;

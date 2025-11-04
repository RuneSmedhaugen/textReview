
import { pipeline } from "@xenova/transformers";

let summarizerPromise = null;
async function getSummarizer() {
  if (!summarizerPromise) {
    console.log("⏳ i love using transformers...");
     summarizerPromise = pipeline("text2text-generation", "Xenova/long-t5-tglobal-base");
  }
  return summarizerPromise;
}

export async function summarizeText(text, type) {
  if (!type || typeof type !== "string") {
    throw new Error("Document type must be provided for summarization.");
  }
  const summarizer = await getSummarizer();
  const cleaned = text.replace(/\s+/g, " ").trim().slice(0, 3000);
  console.log(`Summarizing ${type}...`);

  let prompt;
  switch (type) {
    case "CV":
      prompt = `You are a professional career advisor. Review the following resume and provide:\n- A brief summary of the candidate's key skills, experience, and education\n- Strengths and positive aspects of the CV\n- Weaknesses or areas for improvement\n- Actionable advice to make the CV more attractive to employers\nFormat your feedback in clear bullet points and be specific.\nResume:\n${cleaned}`;
      break;
    case "essay":
      prompt = `Summarize this essay with its main argument, evidence, and conclusion:\n\n${cleaned}`;
      break;
    case "report":
      prompt = `Provide a clear, structured summary of this report, highlighting findings and recommendations:\n\n${cleaned}`;
      break;
    case "article":
      prompt = `Summarize this article, including its topic, intent, and main takeaways:\n\n${cleaned}`;
      break;
    case "business email":
      prompt = `Summarize this business email by describing its purpose, tone, and any requested actions:\n\n${cleaned}`;
      break;
    case "generic text":
      prompt = `Summarize this text clearly and concisely:\n\n${cleaned}`;
      break;
    default:
      throw new Error(`Unknown document type: ${type}`);
  }

  console.log("=== AI PROMPT SENT ===\n", prompt);
  let summary = "No summary returned.";
  try {
    const result = await summarizer(prompt, {
      max_length: 500,
      min_length: 80,
      temperature: 0.7,
      do_sample: false,
      num_beams: 5,
    });
      console.log("=== AI RAW FULL RESULT ===\n", result);
      let aiOutput = undefined;
      if (Array.isArray(result) && result.length > 0) {
        // Try common output keys
        aiOutput = result[0].generated_text || result[0].summary_text || result[0].text || JSON.stringify(result[0]);
      }
    summary = aiOutput?.trim() || "[No summary returned by model.]";
    // If summary is identical to input, return a warning or empty string
    if (summary === cleaned) {
      console.warn("⚠️ Model returned input text as summary. Possible model issue or input too short.");
      summary = "[No meaningful summary generated. Please check your input or try again later.]";
    }
  } catch (err) {
    console.error("Error during summarization:", err);
    summary = "[Error during summarization. Please try again later.]";
  }
  return summary;
}

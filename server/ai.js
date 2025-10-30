import { pipeline } from "@xenova/transformers";

let summarizer;

(async () => {
  console.log("⏳ Loading summarizer...");
  summarizer = await pipeline("text2text-generation", "Xenova/long-t5-tglobal-base");
  console.log("✅ Summarizer ready!");
})();

export async function summarizeText(text, type = "generic text") {
  if (!summarizer) throw new Error("Model not loaded yet.");
  const cleaned = text.replace(/\s+/g, " ").trim().slice(0, 3000);
  console.log(`Summarizing ${type}...`);

  let prompt;
  switch (type) {
    case "CV":
      prompt = `Summarize this resume in concise bullet points, including only key skills, experience, and education:\n\n${cleaned}`;
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
    default:
      prompt = `Summarize this text clearly and concisely:\n\n${cleaned}`;
  }

  const result = await summarizer(prompt, {
    max_length: 500,
    min_length: 80,
    temperature: 0.7,
    do_sample: false,
    num_beams: 5,
  });

  return result[0].generated_text || "No summary returned.";
}

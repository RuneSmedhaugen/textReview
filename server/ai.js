import ollama from "ollama";

export async function summarizeText(text, type = "generic text") {
  const cleaned = text.replace(/\s+/g, " ").trim();

  let prompt;
  switch (type) {
    case "CV":
      prompt = `
You are an expert recruiter reviewing this resume.
Analyze it and give feedback on the following:
- Overall impression
- Key strengths
- Weak points or missing info
- Suggestions to improve structure, clarity, and professional impact
Be specific, actionable, and encouraging.

Resume:
${cleaned}
`;
      break;

    case "essay":
      prompt = `
You are an academic writing coach.
Review this essay and provide:
- Summary of the main argument
- What works well (clarity, evidence, structure, tone)
- What could be improved (logic, grammar, engagement)
- Actionable suggestions to strengthen the essay

Essay:
${cleaned}
`;
      break;

    case "report":
      prompt = `
You are a professional report reviewer.
Evaluate this report and provide:
- Main findings summary
- Strengths in organization and analysis
- Weak areas (missing data, unclear conclusions, formatting)
- Suggestions for improving readability and usefulness

Report:
${cleaned}
`;
      break;

    case "article":
      prompt = `
You are an editorial reviewer.
Analyze this article and discuss:
- Topic and purpose
- Strengths (engagement, clarity, flow)
- Weaknesses (bias, structure, repetitiveness)
- Suggestions to make it more compelling or reader-friendly

Article:
${cleaned}
`;
      break;

    case "business email":
      prompt = `
You are a communication expert.
Review this business email and provide feedback on:
- Tone and clarity
- Effectiveness (is the goal clear?)
- Professionalism and structure
- How to improve readability or persuasion

Email:
${cleaned}
`;
      break;

    default:
      prompt = `
You are a professional writing coach.
Analyze this text and provide:
- Brief summary
- Strengths
- Weaknesses
- Actionable feedback on improvement

Text:
${cleaned}
`;
  }

  console.log(`🦙 Reviewing ${type}...`);

  const response = await ollama.chat({
    model: "llama3",
    messages: [
      { role: "system", content: "You are a helpful and detailed writing reviewer that gives structured, constructive feedback." },
      { role: "user", content: prompt },
    ],
  });

  return response.message?.content || "No feedback generated.";
}

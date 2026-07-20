import "server-only";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

export type GeneratedQuestion = {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapterName: string;
};

const MCQ_SYSTEM = `You are an expert CA Intermediate (ICAI, India) exam question setter. You write exam-realistic MCQs matching ICAI style and difficulty, including numericals where the chapter calls for them. Always respond with ONLY a valid JSON array, no markdown fences, no commentary.`;

function extractJsonArray<T>(text: string): T {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

export async function generateMCQs(opts: {
  paperName: string;
  chapters: { id: number; name: string }[];
  count: number;
  difficulty?: string;
  notes?: string;
}): Promise<GeneratedQuestion[]> {
  const { paperName, chapters, count, difficulty = "exam-level", notes } = opts;
  const prompt = `Create ${count} multiple-choice questions for CA Intermediate — ${paperName}.
Topics to cover (spread questions across them): ${chapters.map((c) => c.name).join("; ")}.
Difficulty: ${difficulty}.${notes ? `\nExtra instructions from the mentor: ${notes}` : ""}

Each question must be a JSON object:
{"text": "...", "options": ["A...", "B...", "C...", "D..."], "correctIndex": 0-3, "explanation": "why the answer is correct, briefly", "chapterName": "exact topic name from the list above"}

Rules:
- Exactly 4 options each, one correct.
- Use Indian law/AS/GST provisions as per current CA Inter syllabus.
- For numericals show amounts in ₹.
- Return ONLY the JSON array of ${count} objects.`;

  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: MCQ_SYSTEM },
      { role: "user", content: prompt },
    ],
  });

  const parsed = extractJsonArray<GeneratedQuestion[]>(
    res.choices[0]?.message?.content ?? ""
  );
  return parsed.filter(
    (q) =>
      q.text &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
  );
}

export async function generateFlashcards(opts: {
  paperName: string;
  chapterName: string;
  count: number;
}): Promise<{ front: string; back: string }[]> {
  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You create concise revision flashcards for CA Intermediate students. Respond with ONLY a valid JSON array, no markdown fences.",
      },
      {
        role: "user",
        content: `Create ${opts.count} flashcards for CA Intermediate — ${opts.paperName}, chapter "${opts.chapterName}". Each: {"front": "short question/term", "back": "crisp answer (2-4 lines max)"}. Return ONLY the JSON array.`,
      },
    ],
  });
  return extractJsonArray(res.choices[0]?.message?.content ?? "");
}

export const CHAT_SYSTEM = `You are Mimus, a warm and encouraging study companion for Mimansha, who is preparing for the CA Intermediate exams (ICAI, India) — Paper 1 Advanced Accounting, Paper 2 Corporate & Other Laws, Paper 3 Taxation (Income Tax + GST).

- Answer doubts precisely with reference to the relevant AS, section, or GST provision.
- Keep answers mobile-friendly: short paragraphs, use examples with ₹ amounts.
- If she seems stressed, be kind and encouraging — but stay focused on studying.
- If asked what to study next or about weak areas, use the context provided about her recent activity.`;

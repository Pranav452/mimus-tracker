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

import { AMENDMENTS_BRIEF } from "@/lib/changes";

const MCQ_SYSTEM = `You are an expert CA Intermediate (ICAI, India) exam question setter. You write exam-realistic MCQs matching ICAI style and difficulty, including numericals where the chapter calls for them. Always respond with ONLY a valid JSON array, no markdown fences, no commentary.

Use CURRENT law as applicable to the January 2027 attempt:
${AMENDMENTS_BRIEF}`;

function extractJsonArray<T>(text: string): T {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  // strip stray backslashes that aren't valid JSON escapes — the model emits
  // things like "\(44AD\)" and one of them would otherwise fail the whole batch
  const json = text.slice(start, end + 1).replace(/\\(?!["\\/bfnrtu])/g, "");
  return JSON.parse(json) as T;
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

// The marking rubric, shared by the typed and photographed paths so the two can
// never drift apart. It follows how ICAI actually awards marks in Paper 2:
// provision, then application to the facts, then a stated conclusion. Marks are
// for the law being right — not for bare-act wording, section numbers or length.
const EXAMINER_SYSTEM = `You are an ICAI CA Intermediate examiner marking a descriptive answer to Paper 2 (Corporate and Other Laws). Mark exactly the way ICAI marks — no stricter, no softer.

ICAI awards marks against three things, in this order:
1. PROVISION — is the relevant law stated correctly? Paraphrasing in the candidate's own words earns FULL marks; bare-act wording is NOT required. A correctly stated provision earns its marks even if the section number is not quoted. Quoting the section number is a bonus that reads well; quoting the WRONG section number is a small deduction.
2. ANALYSIS — is the law applied to the specific facts given in the question? A general restatement of law that never touches the facts loses these marks.
3. CONCLUSION — does the answer actually answer the question asked, in terms? A missing conclusion loses these marks even when the law is right.

Further rules:
- Length is not a criterion. A tight, correct answer scores the same as a long one. Do NOT reward padding, and do NOT penalise brevity that is complete.
- A wrong conclusion still earns the provision and analysis marks that were correctly stated.
- Where the question has distinct limbs (for example two ceilings, or "would your answer differ if..."), each limb carries its own marks — award them independently.
- Award part marks in steps of 0.5. Never exceed the maximum.
- She wrote this under exam time pressure, possibly in shorthand or note form. Judge the SUBSTANCE, not the prose, spelling or handwriting.`;

/** Marks a typed answer — what she keys in after writing in her book. */
export async function evaluateWrittenAnswer(opts: {
  question: string;
  modelAnswer: string;
  keyPoints: string[];
  maxMarks: number;
  answer: string;
}): Promise<{ marks: number; feedback: string }> {
  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: `${EXAMINER_SYSTEM}

Respond with ONLY a JSON object, no markdown fences:
{"marks": <number>, "feedback": "<2-4 sentences: what earned marks, what was missing against provision/analysis/conclusion, and the single most valuable thing to add next time>"}

${AMENDMENTS_BRIEF}`,


      },
      {
        role: "user",
        content: `QUESTION (${opts.maxMarks} marks):
${opts.question}

MODEL ANSWER:
${opts.modelAnswer}

POINTS THE EXAMINER LOOKS FOR:
${opts.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

HER ANSWER:
${opts.answer}

Mark it out of ${opts.maxMarks}.`,
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "";
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Examiner did not return JSON");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as {
    marks: number;
    feedback: string;
  };
  return {
    marks: Number.isFinite(parsed.marks) ? parsed.marks : 0,
    feedback: parsed.feedback ?? "",
  };
}

/**
 * Same examiner, but reading a photo of the answer she actually handwrote —
 * so the marking is done on the full answer rather than a typed summary of it.
 * Returns the transcript too, which is stored as her answer of record.
 */
export async function evaluateWrittenPhoto(opts: {
  question: string;
  modelAnswer: string;
  keyPoints: string[];
  maxMarks: number;
  imageDataUrl: string;
}): Promise<{ transcript: string; marks: number; feedback: string }> {
  const res = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: `${EXAMINER_SYSTEM}

The answer reaches you as a PHOTOGRAPH of a handwritten answer sheet. First transcribe what is written, as faithfully as you can — keep her abbreviations and shorthand, and use [illegible] where you genuinely cannot read a word. Never invent content that is not on the page: an answer that is half unreadable should be marked on what IS readable, and the feedback should say so. Handwriting quality is NOT a marking criterion.

Respond with ONLY a JSON object, no markdown fences:
{"transcript": "<what she wrote>", "marks": <number>, "feedback": "<2-4 sentences>"}

${AMENDMENTS_BRIEF}`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `QUESTION (${opts.maxMarks} marks):
${opts.question}

MODEL ANSWER:
${opts.modelAnswer}

POINTS THE EXAMINER LOOKS FOR:
${opts.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Transcribe the attached handwritten answer, then mark it out of ${opts.maxMarks}.`,
          },
          { type: "image_url", image_url: { url: opts.imageDataUrl } },
        ],
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "";
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Examiner did not return JSON");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as {
    transcript: string;
    marks: number;
    feedback: string;
  };
  return {
    transcript: parsed.transcript ?? "",
    marks: Number.isFinite(parsed.marks) ? parsed.marks : 0,
    feedback: parsed.feedback ?? "",
  };
}

export const CHAT_SYSTEM = `You are Mimus, a warm and encouraging study companion for Mimansha, who is preparing for the CA Intermediate exams (ICAI, India) — Paper 1 Advanced Accounting, Paper 2 Corporate & Other Laws, Paper 3 Taxation (Income Tax + GST).

- Answer doubts precisely with reference to the relevant AS, section, or GST provision.
- Keep answers mobile-friendly: short paragraphs, use examples with ₹ amounts.
- If she seems stressed, be kind and encouraging — but stay focused on studying.
- If asked what to study next or about weak areas, use the context provided about her recent activity.`;

import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["student", "admin"] })
    .notNull()
    .default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tag: text("tag").notNull(), // e.g. "CA INTER"
  color: text("color").notNull(), // soft color token for the card
  image: text("image").notNull(),
});

export const parts = pgTable("parts", {
  id: serial("id").primaryKey(),
  paperId: integer("paper_id")
    .notNull()
    .references(() => papers.id),
  label: text("label").notNull(), // "Part A"
  name: text("name"), // e.g. "Income Tax"
  sort: integer("sort").notNull().default(0),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  partId: integer("part_id")
    .notNull()
    .references(() => parts.id),
  number: integer("number").notNull(),
  name: text("name").notNull(),
});

// what Mimansha says she's studying on a given day
export const dailyTopics = pgTable("daily_topics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => chapters.id),
  forDate: date("for_date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chapterProgress = pgTable(
  "chapter_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id),
    status: text("status", {
      enum: ["not_started", "in_progress", "done"],
    })
      .notNull()
      .default("not_started"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("chapter_progress_user_chapter").on(t.userId, t.chapterId)]
);

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  paperId: integer("paper_id").references(() => papers.id),
  scheduledFor: date("scheduled_for"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// testId null => chapter practice-quiz question
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => tests.id, { onDelete: "cascade" }),
  chapterId: integer("chapter_id").references(() => chapters.id),
  section: text("section"), // e.g. "Part A", shown as section tabs
  seq: integer("seq").notNull().default(0),
  // "mcq" auto-grades against correctIndex; "descriptive" is written by hand and
  // scored afterwards against modelAnswer — see evaluateWritten() in actions/study.
  kind: text("kind", { enum: ["mcq", "descriptive"] })
    .notNull()
    .default("mcq"),
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(), // [] for descriptive
  correctIndex: integer("correct_index"), // null for descriptive
  marks: real("marks").notNull().default(4),
  negativeMarks: real("negative_marks").notNull().default(1),
  explanation: text("explanation"),
  // descriptive only: the model answer she is marked against, and the point-wise
  // breakdown the examiner would award on
  modelAnswer: text("model_answer"),
  keyPoints: jsonb("key_points").$type<string[]>(),
  // Set on the copies a Daily 5 serves: points at the bank question it was
  // copied from, so her history on a question follows it across quizzes and
  // the picker can tell "never seen" from "got wrong last time".
  sourceQuestionId: integer("source_question_id"),
});

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  testId: integer("test_id")
    .notNull()
    .references(() => tests.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  timeTakenSeconds: integer("time_taken_seconds"),
  score: real("score"),
  maxScore: real("max_score"),
  correctCount: integer("correct_count"),
  incorrectCount: integer("incorrect_count"),
  unattemptedCount: integer("unattempted_count"),
  accuracy: real("accuracy"),
});

export const attemptAnswers = pgTable(
  "attempt_answers",
  {
    id: serial("id").primaryKey(),
    attemptId: integer("attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    selectedIndex: integer("selected_index"),
    isCorrect: boolean("is_correct"),
    marksAwarded: real("marks_awarded"),
    bookmarked: boolean("bookmarked").notNull().default(false),
    // descriptive answers: what she wrote, and the evaluation of it. `scored`
    // stays false until it is marked, so a written paper shows a pending score
    // rather than a silent zero.
    textAnswer: text("text_answer"),
    aiFeedback: text("ai_feedback"),
    scored: boolean("scored").notNull().default(true),
    // seconds spent looking at this question during the attempt — powers the
    // pace report (her 1-minute-per-MCQ practice) on the results screen
    timeSpentSeconds: real("time_spent_seconds"),
  },
  (t) => [uniqueIndex("attempt_answers_attempt_question").on(t.attemptId, t.questionId)]
);

// powers the streak calendar: one row per user/date/kind
export const activityLog = pgTable(
  "activity_log",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    onDate: date("on_date").notNull(),
    kind: text("kind", {
      enum: ["login", "test", "topic", "course"],
    }).notNull(),
  },
  (t) => [uniqueIndex("activity_user_date_kind").on(t.userId, t.onDate, t.kind)]
);

export const chatThreads = pgTable("chat_threads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull().default("New chat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  threadId: integer("thread_id").references(() => chatThreads.id, {
    onDelete: "cascade",
  }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// day-by-day exam prep plan, checkable
export const planItems = pgTable("plan_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  onDate: date("on_date").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  kind: text("kind", {
    enum: ["study", "revise", "practice", "test", "exam", "holiday"],
  })
    .notNull()
    .default("study"),
  done: boolean("done").notNull().default(false),
  // chapters this item covers — drives auto-ticking when she logs a topic
  chapterIds: jsonb("chapter_ids").$type<number[]>().notNull().default([]),
  // chapters whose notes / flashcards / quiz are shown beside this item on the
  // home screen. A superset of chapterIds; never used for auto-ticking.
  refChapterIds: jsonb("ref_chapter_ids").$type<number[]>().notNull().default([]),
  // an in-app test this item points at ("App mock: GST full syllabus")
  testId: integer("test_id"),
  // true once she ticks/unticks by hand; auto-sync then leaves it alone
  manual: boolean("manual").notNull().default(false),
  // logged topics that satisfied this item (audit trail for the auto-tick)
  sourceTopicIds: jsonb("source_topic_ids").$type<number[]>().notNull().default([]),
  sort: integer("sort").notNull().default(0),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => chapters.id),
  front: text("front").notNull(),
  back: text("back").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Hand-authored study notes for a chapter — rendered in the chapter's Learn tab.
// Content is structured blocks (see components/NotesView.tsx), not free markdown,
// so the UI can style comparisons, worked examples and traps distinctly.
export const chapterNotes = pgTable("chapter_notes", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id")
    .notNull()
    .unique()
    .references(() => chapters.id),
  title: text("title").notNull(),
  content: jsonb("content").$type<unknown[]>().notNull(),
  // the concepts this note explains, shown as chips on /explanations — one note
  // often covers several of the things she asked about by name
  concepts: jsonb("concepts").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

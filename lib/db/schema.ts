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
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  marks: real("marks").notNull().default(4),
  negativeMarks: real("negative_marks").notNull().default(1),
  explanation: text("explanation"),
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
    enum: ["study", "revise", "practice", "test", "exam"],
  })
    .notNull()
    .default("study"),
  done: boolean("done").notNull().default(false),
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

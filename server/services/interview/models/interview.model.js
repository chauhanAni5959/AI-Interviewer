import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
    },
    correctness: {
      type: Number,
      default: 0,
    },

    clarity: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    details: {
      type: Number,
      default: 0,
    },
    efficiency: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    problemSolving: {
      type: Number,
      default: 0,
    },
    creativity: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    improvement: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const questionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      default: "easy",
    },
    timer: {
      type: Number,
      default: 60,
    },
    feedback: {
      type: feedbackSchema,
      default: () => ({}),
    },
  },
  { _id: false },
);

const interviewSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["technical", "hr", "managerial"],
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    useResume: {
      type: Boolean,
      default: false,
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [questionsSchema],
      default: [],
    },
    overallscore: {
      type: Number,
      default: 0,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      deafult: "",
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;

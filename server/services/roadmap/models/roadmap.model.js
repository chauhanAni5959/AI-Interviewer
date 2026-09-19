import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    targetRole: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    goal: { type: String, required: true },
    hoursPerWeek: { type: Number, required: true },
    roadmap: {
      title: { type: String, required: true },
      overview: { type: String, default: "" },
      duration: { type: String, default: "" },
      focusAreas: { type: [String], default: [] },
      phases: { type: [Object], default: [] },
      interviewFocus: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;

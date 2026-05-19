import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    targetDate: {
      type: Date,
    },
    category: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Goal ||
  mongoose.model("Goal", GoalSchema);

import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: String,
    amount: Number,
    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.Income ||
  mongoose.model("Income", IncomeSchema);
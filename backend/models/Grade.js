const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true, trim: true },
    term: { type: String, required: true, trim: true }, // e.g. "الفصل الأول"
    score: { type: Number, required: true, min: 0, max: 100 },
    maxScore: { type: Number, default: 100 },
    examType: { type: String, enum: ["quiz", "midterm", "final", "homework", "other"], default: "other" },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grade", gradeSchema);

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female"] },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ClassRoom" },
    address: { type: String, trim: true },
    enrollmentDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);

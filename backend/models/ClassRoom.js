const mongoose = require("mongoose");

const classRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "الصف العاشر - أ"
    level: { type: String, trim: true }, // e.g. "Grade 10"
    homeroomTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassRoom", classRoomSchema);

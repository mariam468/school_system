const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const ClassRoom = require("../models/ClassRoom");
const Grade = require("../models/Grade");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/overview", async (req, res) => {
  const [studentCount, teacherCount, classCount, gradeCount] = await Promise.all([
    Student.countDocuments({ active: true }),
    User.countDocuments({ role: "teacher" }),
    ClassRoom.countDocuments(),
    Grade.countDocuments(),
  ]);

  const avgResult = await Grade.aggregate([{ $group: { _id: null, avg: { $avg: "$score" } } }]);
  const averageScore = avgResult[0]?.avg ? Math.round(avgResult[0].avg * 10) / 10 : null;

  res.json({ studentCount, teacherCount, classCount, gradeCount, averageScore });
});

module.exports = router;

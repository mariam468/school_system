const express = require("express");
const Grade = require("../models/Grade");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Both admin and teachers can manage grades
router.get("/", async (req, res) => {
  const { student, subject, term } = req.query;
  const filter = {};
  if (student) filter.student = student;
  if (subject) filter.subject = subject;
  if (term) filter.term = term;

  const grades = await Grade.find(filter)
    .populate("student", "fullName studentId")
    .populate("enteredBy", "name")
    .sort({ createdAt: -1 });
  res.json(grades);
});

router.post("/", async (req, res) => {
  try {
    const grade = await Grade.create({ ...req.body, enteredBy: req.user._id });
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ message: "تعذر إضافة العلامة", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!grade) return res.status(404).json({ message: "العلامة غير موجودة" });
    res.json(grade);
  } catch (err) {
    res.status(400).json({ message: "تعذر تعديل العلامة", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const grade = await Grade.findByIdAndDelete(req.params.id);
  if (!grade) return res.status(404).json({ message: "العلامة غير موجودة" });
  res.json({ message: "تم حذف العلامة بنجاح" });
});

module.exports = router;

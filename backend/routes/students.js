const express = require("express");
const Student = require("../models/Student");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  const { search, classRoom } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
    ];
  }
  if (classRoom) filter.classRoom = classRoom;

  const students = await Student.find(filter).populate("classRoom", "name level").sort({ createdAt: -1 });
  res.json(students);
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id).populate("classRoom", "name level");
  if (!student) return res.status(404).json({ message: "الطالب غير موجود" });
  res.json(student);
});

router.post("/", adminOnly, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: "تعذر إضافة الطالب", error: err.message });
  }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: "تعذر تعديل بيانات الطالب", error: err.message });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "الطالب غير موجود" });
  res.json({ message: "تم حذف الطالب بنجاح" });
});

module.exports = router;

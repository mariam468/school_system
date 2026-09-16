const express = require("express");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).sort({ createdAt: -1 });
  res.json(teachers.map((t) => t.toSafeObject()));
});

router.post("/", adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, subject } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقاً" });

    const teacher = await User.create({ name, email, password, phone, subject, role: "teacher" });
    res.status(201).json(teacher.toSafeObject());
  } catch (err) {
    res.status(400).json({ message: "تعذر إضافة المعلم", error: err.message });
  }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { name, phone, subject, active } = req.body;
    const teacher = await User.findOneAndUpdate(
      { _id: req.params.id, role: "teacher" },
      { name, phone, subject, active },
      { new: true, runValidators: true }
    );
    if (!teacher) return res.status(404).json({ message: "المعلم غير موجود" });
    res.json(teacher.toSafeObject());
  } catch (err) {
    res.status(400).json({ message: "تعذر تعديل بيانات المعلم", error: err.message });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  const teacher = await User.findOneAndDelete({ _id: req.params.id, role: "teacher" });
  if (!teacher) return res.status(404).json({ message: "المعلم غير موجود" });
  res.json({ message: "تم حذف المعلم بنجاح" });
});

module.exports = router;

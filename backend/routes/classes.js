const express = require("express");
const ClassRoom = require("../models/ClassRoom");
const Student = require("../models/Student");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  const classes = await ClassRoom.find().populate("homeroomTeacher", "name subject").sort({ name: 1 });
  const withCounts = await Promise.all(
    classes.map(async (c) => {
      const studentCount = await Student.countDocuments({ classRoom: c._id });
      return { ...c.toObject(), studentCount };
    })
  );
  res.json(withCounts);
});

router.post("/", adminOnly, async (req, res) => {
  try {
    const classRoom = await ClassRoom.create(req.body);
    res.status(201).json(classRoom);
  } catch (err) {
    res.status(400).json({ message: "تعذر إضافة الصف", error: err.message });
  }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const classRoom = await ClassRoom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!classRoom) return res.status(404).json({ message: "الصف غير موجود" });
    res.json(classRoom);
  } catch (err) {
    res.status(400).json({ message: "تعذر تعديل الصف", error: err.message });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  const classRoom = await ClassRoom.findByIdAndDelete(req.params.id);
  if (!classRoom) return res.status(404).json({ message: "الصف غير موجود" });
  res.json({ message: "تم حذف الصف بنجاح" });
});

module.exports = router;

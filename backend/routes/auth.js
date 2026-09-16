const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Register a new user (admin creates teacher/admin accounts). First admin can be seeded via /seed.
router.post("/register", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, phone, subject } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقاً" });

    const user = await User.create({ name, email, password, role, phone, subject });
    res.status(201).json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: "خطأ في إنشاء المستخدم", error: err.message });
  }
});

// One-time bootstrap: create the first admin if no users exist at all
router.post("/seed-admin", async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(400).json({ message: "تم إعداد النظام مسبقاً" });

    const { name, email, password } = req.body;
    const adminEmail = email || process.env.ADMIN_EMAIL;
    const adminPassword = password || process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: "يجب توفير email و password" });
    }

    const admin = await User.create({ 
      name: name || "مدير المدرسة", 
      email: adminEmail, 
      password: adminPassword, 
      role: "admin" 
    });
    const token = signToken(admin._id);
    res.status(201).json({ user: admin.toSafeObject(), token });
  } catch (err) {
    res.status(500).json({ message: "خطأ في إنشاء حساب المدير", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
    if (!user.active) return res.status(403).json({ message: "الحساب معطل، الرجاء التواصل مع الإدارة" });

    const token = signToken(user._id);
    res.json({ user: user.toSafeObject(), token });
  } catch (err) {
    res.status(500).json({ message: "خطأ في تسجيل الدخول", error: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user.toSafeObject());
});

module.exports = router;

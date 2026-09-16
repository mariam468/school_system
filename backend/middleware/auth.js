const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "غير مصرح - الرجاء تسجيل الدخول" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.active) return res.status(401).json({ message: "المستخدم غير موجود أو غير مفعل" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "جلسة غير صالحة، الرجاء تسجيل الدخول مجدداً" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "هذا الإجراء متاح للمدير فقط" });
  }
  next();
};

module.exports = { protect, adminOnly };

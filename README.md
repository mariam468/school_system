# نظام إدارة المدرسة (مدرستي)

نظام كامل (Full Stack) لإدارة مدرسة: طلاب، معلمين، صفوف، وعلامات — مع لوحة تحكم للمدير.

- **Frontend**: React + Vite + TailwindCSS (واجهة عربية RTL)
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT Auth

## المميزات
- تسجيل دخول آمن (JWT) بصلاحيتين: **مدير (admin)** و **معلم (teacher)**
- المدير فقط يقدر يضيف/يعدّل/يحذف: الطلاب، المعلمين، الصفوف
- المعلمون قادرون على إدخال العلامات ومشاهدة كل شيء
- لوحة تحكم فيها إحصائيات سريعة (عدد الطلاب، المعلمين، الصفوف، متوسط العلامات)
- تصميم عصري وبسيط يشتغل تمام على الموبايل والكمبيوتر

## طريقة التشغيل

### 1) تجهيز الـ Backend
```bash
cd backend
cp .env.example .env   # عدّل MONGO_URI و JWT_SECRET حسب حالك
npm install
npm run dev            # أو: npm start
```
لازم يكون عندك MongoDB شغال (محلي أو MongoDB Atlas مجاني).

### 2) إنشاء أول حساب مدير (مرة وحدة فقط)
بعد ما يشتغل السيرفر، ابعت طلب POST لمرة وحدة فقط لإنشاء حساب المدير الأول:
```bash
curl -X POST http://localhost:5000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"مدير المدرسة","email":"admin@school.com","password":"123456"}'
```
هيدا الـ endpoint بيشتغل مرة وحدة بس (لما ما يكون في أي مستخدم بالنظام). بعدها استعمل نفس الإيميل وكلمة المرور لتسجيل الدخول من الموقع.

### 3) تجهيز الـ Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
افتح المتصفح على: http://localhost:5173

## هيكلية المشروع
```
school-system/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Student, ClassRoom, Grade)
│   ├── routes/ (auth, students, teachers, classes, grades, stats)
│   ├── middleware/auth.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/ (Login, Dashboard, Students, Teachers, Classes, Grades)
        ├── components/ (Sidebar, Layout, Modal, StatCard, Field)
        ├── context/AuthContext.jsx
        └── api/axios.js
```

## خطوات بعدها (اختياري)
- رفع الصور الشخصية للطلاب والمعلمين
- تصدير كشوف العلامات كـ PDF
- إشعارات لأولياء الأمور عبر إيميل أو SMS
- صفحة خاصة لكل معلم يشوف فيها صفوفه فقط

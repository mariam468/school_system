import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Field, { TextInput, SelectInput } from "../components/Field";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", level: "", homeroomTeacher: "" };

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  const load = () => api.get("/classes").then((res) => setClasses(res.data));

  useEffect(() => {
    load();
    api.get("/teachers").then((res) => setTeachers(res.data));
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setError("");
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/classes", form);
      setOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصف؟")) return;
    await api.delete(`/classes/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">الصفوف الدراسية</h2>
          <p className="text-ink/60 mt-1">تنظيم الصفوف والمعلمين المسؤولين</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            + إضافة صف
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <div key={c._id} className="bg-white rounded-card shadow-soft p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold">{c.name}</h3>
                <p className="text-ink/50 text-xs mt-0.5">{c.level}</p>
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(c._id)} className="text-clay text-sm hover:underline">
                  حذف
                </button>
              )}
            </div>
            <p className="text-sm text-ink/60">المعلم المسؤول: {c.homeroomTeacher?.name || "غير محدد"}</p>
            <p className="text-sm text-ink/60 mt-1">عدد الطلاب: {c.studentCount}</p>
          </div>
        ))}
        {classes.length === 0 && (
          <p className="text-ink/40 col-span-full text-center py-8">لا يوجد صفوف حتى الآن</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة صف جديد">
        <form onSubmit={handleSubmit}>
          <Field label="اسم الصف">
            <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="المستوى">
            <TextInput value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          </Field>
          <Field label="المعلم المسؤول">
            <SelectInput
              value={form.homeroomTeacher}
              onChange={(e) => setForm({ ...form, homeroomTeacher: e.target.value })}
            >
              <option value="">بدون تحديد</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg mt-2 transition-colors"
          >
            إضافة الصف
          </button>
        </form>
      </Modal>
    </Layout>
  );
}

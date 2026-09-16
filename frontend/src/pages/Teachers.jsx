import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Field, { TextInput } from "../components/Field";
import api from "../api/axios";

const emptyForm = { name: "", email: "", password: "", phone: "", subject: "" };

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => api.get("/teachers").then((res) => setTeachers(res.data));

  useEffect(() => {
    load();
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
      await api.post("/teachers", form);
      setOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };

  const toggleActive = async (t) => {
    await api.put(`/teachers/${t.id}`, { ...t, active: !t.active });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;
    await api.delete(`/teachers/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">المعلمون</h2>
          <p className="text-ink/60 mt-1">إدارة حسابات وأساتذة المدرسة</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + إضافة معلم
        </button>
      </div>

      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-brand-700">
            <tr>
              <th className="text-right px-4 py-3 font-bold">الاسم</th>
              <th className="text-right px-4 py-3 font-bold">المادة</th>
              <th className="text-right px-4 py-3 font-bold">البريد الإلكتروني</th>
              <th className="text-right px-4 py-3 font-bold">الهاتف</th>
              <th className="text-right px-4 py-3 font-bold">الحالة</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-t border-ink/5 hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-ink/60">{t.subject || "—"}</td>
                <td className="px-4 py-3 text-ink/60">{t.email}</td>
                <td className="px-4 py-3 text-ink/60">{t.phone || "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(t)}
                    className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      t.active ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {t.active ? "مفعّل" : "معطّل"}
                  </button>
                </td>
                <td className="px-4 py-3 text-left whitespace-nowrap">
                  <button onClick={() => handleDelete(t.id)} className="text-clay hover:underline">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  لا يوجد معلمون حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة معلم جديد">
        <form onSubmit={handleSubmit}>
          <Field label="الاسم الكامل">
            <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="البريد الإلكتروني">
            <TextInput
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="كلمة المرور المبدئية">
            <TextInput
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="المادة التي يدرّسها">
            <TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="رقم الهاتف">
            <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg mt-2 transition-colors"
          >
            إضافة المعلم
          </button>
        </form>
      </Modal>
    </Layout>
  );
}

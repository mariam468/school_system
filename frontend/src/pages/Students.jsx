import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Field, { TextInput, SelectInput } from "../components/Field";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  fullName: "",
  studentId: "",
  gender: "male",
  guardianName: "",
  guardianPhone: "",
  classRoom: "",
  address: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  const load = () => {
    api.get("/students", { params: { search } }).then((res) => setStudents(res.data));
  };

  useEffect(() => {
    load();
    api.get("/classes").then((res) => setClasses(res.data));
  }, [search]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setOpen(true);
  };

  const openEdit = (s) => {
    setForm({
      fullName: s.fullName,
      studentId: s.studentId,
      gender: s.gender || "male",
      guardianName: s.guardianName || "",
      guardianPhone: s.guardianPhone || "",
      classRoom: s.classRoom?._id || "",
      address: s.address || "",
    });
    setEditingId(s._id);
    setError("");
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, form);
      } else {
        await api.post("/students", form);
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;
    await api.delete(`/students/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">الطلاب</h2>
          <p className="text-ink/60 mt-1">إدارة سجلات الطلاب</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            + إضافة طالب
          </button>
        )}
      </div>

      <input
        placeholder="ابحث بالاسم أو الرقم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-5 px-3 py-2 rounded-lg border border-ink/15 focus-ring text-sm bg-white"
      />

      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-brand-700">
            <tr>
              <th className="text-right px-4 py-3 font-bold">الاسم</th>
              <th className="text-right px-4 py-3 font-bold">الرقم</th>
              <th className="text-right px-4 py-3 font-bold">الصف</th>
              <th className="text-right px-4 py-3 font-bold">ولي الأمر</th>
              <th className="text-right px-4 py-3 font-bold">هاتف ولي الأمر</th>
              {isAdmin && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t border-ink/5 hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{s.fullName}</td>
                <td className="px-4 py-3 text-ink/60">{s.studentId}</td>
                <td className="px-4 py-3 text-ink/60">{s.classRoom?.name || "—"}</td>
                <td className="px-4 py-3 text-ink/60">{s.guardianName || "—"}</td>
                <td className="px-4 py-3 text-ink/60">{s.guardianPhone || "—"}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-left whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-brand-600 hover:underline ml-3">
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="text-clay hover:underline">
                      حذف
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  لا يوجد طلاب حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? "تعديل بيانات طالب" : "إضافة طالب جديد"}>
        <form onSubmit={handleSubmit}>
          <Field label="الاسم الكامل">
            <TextInput
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Field>
          <Field label="الرقم المدرسي">
            <TextInput
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            />
          </Field>
          <Field label="الجنس">
            <SelectInput value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </SelectInput>
          </Field>
          <Field label="الصف">
            <SelectInput value={form.classRoom} onChange={(e) => setForm({ ...form, classRoom: e.target.value })}>
              <option value="">بدون صف</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="اسم ولي الأمر">
            <TextInput
              value={form.guardianName}
              onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
            />
          </Field>
          <Field label="هاتف ولي الأمر">
            <TextInput
              value={form.guardianPhone}
              onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
            />
          </Field>
          <Field label="العنوان">
            <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg mt-2 transition-colors"
          >
            {editingId ? "حفظ التعديلات" : "إضافة الطالب"}
          </button>
        </form>
      </Modal>
    </Layout>
  );
}

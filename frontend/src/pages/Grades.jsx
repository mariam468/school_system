import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Field, { TextInput, SelectInput } from "../components/Field";
import api from "../api/axios";

const emptyForm = { student: "", subject: "", term: "الفصل الأول", score: "", examType: "quiz" };

const examLabels = {
  quiz: "اختبار قصير",
  midterm: "امتحان نصفي",
  final: "امتحان نهائي",
  homework: "واجب منزلي",
  other: "أخرى",
};

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => api.get("/grades").then((res) => setGrades(res.data));

  useEffect(() => {
    load();
    api.get("/students").then((res) => setStudents(res.data));
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
      await api.post("/grades", { ...form, score: Number(form.score) });
      setOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه العلامة؟")) return;
    await api.delete(`/grades/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">العلامات</h2>
          <p className="text-ink/60 mt-1">تسجيل ومتابعة علامات الطلاب</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + إضافة علامة
        </button>
      </div>

      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-brand-700">
            <tr>
              <th className="text-right px-4 py-3 font-bold">الطالب</th>
              <th className="text-right px-4 py-3 font-bold">المادة</th>
              <th className="text-right px-4 py-3 font-bold">النوع</th>
              <th className="text-right px-4 py-3 font-bold">الفصل</th>
              <th className="text-right px-4 py-3 font-bold">العلامة</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g._id} className="border-t border-ink/5 hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{g.student?.fullName}</td>
                <td className="px-4 py-3 text-ink/60">{g.subject}</td>
                <td className="px-4 py-3 text-ink/60">{examLabels[g.examType]}</td>
                <td className="px-4 py-3 text-ink/60">{g.term}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${
                      g.score >= 60 ? "text-brand-600" : "text-clay"
                    }`}
                  >
                    {g.score}/{g.maxScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-left whitespace-nowrap">
                  <button onClick={() => handleDelete(g._id)} className="text-clay hover:underline">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {grades.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  لا يوجد علامات مسجلة حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة علامة جديدة">
        <form onSubmit={handleSubmit}>
          <Field label="الطالب">
            <SelectInput required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
              <option value="">اختر الطالب</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="المادة">
            <TextInput required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="نوع الاختبار">
            <SelectInput value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
              {Object.entries(examLabels).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="الفصل الدراسي">
            <TextInput required value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
          </Field>
          <Field label="العلامة (من 100)">
            <TextInput
              type="number"
              min={0}
              max={100}
              required
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
            />
          </Field>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg mt-2 transition-colors"
          >
            حفظ العلامة
          </button>
        </form>
      </Modal>
    </Layout>
  );
}

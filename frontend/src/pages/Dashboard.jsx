import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const displayName = user?.name?.includes("?") ? "School Admin" : user?.name;

  useEffect(() => {
    api.get("/stats/overview").then((res) => setStats(res.data));
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold">أهلاً {displayName} 👋</h2>
        <p className="text-ink/60 mt-1">نظرة عامة على حالة المدرسة اليوم</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <StatCard label="عدد الطلاب" value={stats?.studentCount} accent="brand" />
        <StatCard label="عدد المعلمين" value={stats?.teacherCount} accent="clay" />
        <StatCard label="عدد الصفوف" value={stats?.classCount} accent="gold" />
        <StatCard label="متوسط العلامات" value={stats?.averageScore} accent="brand" />
      </div>

      <div className="bg-white rounded-card shadow-soft p-6">
        <h3 className="font-display font-bold mb-3">البدء السريع</h3>
        <ul className="space-y-2 text-sm text-ink/70">
          <li>• أضف طالباً جديداً من صفحة "الطلاب"</li>
          <li>• أدخل علامات الطلاب من صفحة "العلامات"</li>
          <li>• أدر حسابات المعلمين من صفحة "المعلمون" (المدير فقط)</li>
          <li>• نظّم الصفوف الدراسية من صفحة "الصفوف"</li>
        </ul>
      </div>
    </Layout>
  );
}

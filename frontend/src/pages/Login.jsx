import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-700 p-4">
      <div className="bg-white rounded-card shadow-soft w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-brand-700">مدرستي</h1>
          <p className="text-ink/60 text-sm mt-1">تسجيل الدخول إلى نظام إدارة المدرسة</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="block text-sm text-ink/70 mb-1">البريد الإلكتروني</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring text-sm"
              placeholder="name@school.com"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm text-ink/70 mb-1">كلمة المرور</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring text-sm"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

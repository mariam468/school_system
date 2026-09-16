import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/", label: "لوحة التحكم", icon: "▦", adminOnly: false },
  { to: "/students", label: "الطلاب", icon: "🎓", adminOnly: false },
  { to: "/teachers", label: "المعلمون", icon: "👤", adminOnly: true },
  { to: "/classes", label: "الصفوف", icon: "🏫", adminOnly: false },
  { to: "/grades", label: "العلامات", icon: "✎", adminOnly: false },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const displayName = user?.name?.includes("?") ? "School Admin" : user?.name;

  return (
    <aside className="w-64 shrink-0 bg-brand-700 text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-display text-xl font-bold leading-tight">مدرستي</h1>
        <p className="text-brand-100 text-sm mt-1">نظام الإدارة المدرسية</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items
          .filter((i) => !i.adminOnly || isAdmin)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-card text-sm transition-colors ${
                  isActive ? "bg-white text-brand-700 font-bold" : "text-brand-50 hover:bg-white/10"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-sm mb-3">
          <p className="font-bold">{displayName}</p>
          <p className="text-brand-100 text-xs">{user?.role === "admin" ? "مدير النظام" : "معلم"}</p>
        </div>
        <button
          onClick={logout}
          className="w-full text-sm text-right px-4 py-2 rounded-card bg-white/10 hover:bg-white/20 transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

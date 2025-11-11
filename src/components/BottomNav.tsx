import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const nav = useNavigate();
  const loc = useLocation();

  const tabs = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "📊", label: "Analytics", path: "/analytics" },
    { icon: "📸", label: "AI Scanning", path: "/ai-scan" }, // ✅ 修改：使用相机 emoji 📸
    { icon: "👤", label: "Profile", path: "/profile" },
  ];

  return (
    <div className="dock">
      {tabs.map((t) => {
        const active = loc.pathname === t.path;
        return (
          <div
            key={t.path}
            className={`tab ${active ? "active" : ""}`}
            onClick={() => nav(t.path)}
          >
            <div className="tab-icon">{t.icon}</div>
            <div className="tab-text">{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

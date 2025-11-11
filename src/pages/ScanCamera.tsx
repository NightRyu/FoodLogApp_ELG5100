import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

export default function ScanCamera() {
  const nav = useNavigate();
  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <div className="user">AI Camera</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Coming Soon</div>
        <div className="muted">We will enable camera scanning here.</div>
      </div>

      <BottomNav />
    </div>
  );
}

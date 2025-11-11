import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";


export default function Scan() {
  const nav = useNavigate();

  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      <div className="topbar">
        <div className="user">Scanning</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      {/* 上方展示本地鸡肉沙拉图（完整显示，不裁切） */}
      <div className="scan-stage">
        <img
          src={saladImg}
          alt="Chicken Salad"
          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 16 }}
        />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <button
          className="primary-btn"
          onClick={() =>
            nav("/result", {
              state: {
                preview: saladImg,    // 传递同一张图到结果页
                dish: "Chicken Salad",
                kcalPer100: 159,      // demo 值
                macros: { carbs: 50, protein: 50, fat: 50 },
              },
            })
          }
        >
          Start Scanning
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

export default function FoodDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const food = state || {};

  const [saved, setSaved] = useState<boolean>(food.saved || false);

  const handleSave = () => {
    if (saved) return;
    const stored = JSON.parse(localStorage.getItem("savedFoods") || "[]");
    const exists = stored.find((f: any) => f.name === food.name);
    if (!exists) {
      stored.push(food);
      localStorage.setItem("savedFoods", JSON.stringify(stored));
      setSaved(true);
      alert(`${food.name} saved to your food library.`);
    } else {
      setSaved(true);
    }
  };

  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      {/* 顶部 */}
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <button
          className="ghost"
          onClick={handleSave}
          disabled={saved}
          style={{ padding: "6px 12px", fontWeight: 700 }}
        >
          {saved ? "✅ Saved" : "💾 Save"}
        </button>
        <div className="user" style={{ fontWeight: 700 }}>
          {food.name || "Unknown Food"}
        </div>
        <button className="ghost" onClick={() => nav(-1)}>
          Back
        </button>
      </div>

      {/* 内容卡片 */}
      <div className="card" style={{ textAlign: "center" }}>
        <h3 style={{ fontWeight: 800 }}>{food.name}</h3>
        <p style={{ color: "#64748b", marginTop: -6 }}>{food.kcal} kcal</p>

        {/* 三大营养素 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div className="chip">
            <div>🥖 {food.macros?.carbs ?? 0}g</div>
            <div className="muted">Carbs</div>
          </div>
          <div className="chip">
            <div>🍗 {food.macros?.protein ?? 0}g</div>
            <div className="muted">Protein</div>
          </div>
          <div className="chip">
            <div>🥑 {food.macros?.fat ?? 0}g</div>
            <div className="muted">Fat</div>
          </div>
        </div>

        {/* 食物组成 */}
        {food.ingredients && (
          <div style={{ marginTop: 18, textAlign: "left" }}>
            <b>Ingredients:</b>
            <ul style={{ marginTop: 6 }}>
              {food.ingredients.map((ing: any, i: number) => (
                <li key={i}>
                  {ing.name} {ing.grams ? `– ${ing.grams}g` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

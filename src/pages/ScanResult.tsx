// src/pages/ScanResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { addTodayWithIngredients } from "@/store/useMeals";
import { useState } from "react";

export default function ScanResult() {
  const nav = useNavigate();
  const { state } = useLocation();
  const result = state || {};

  const dish = result.name || result.dish || "Unknown Food";
  const kcal = result.kcal || 0;
  const macros = result.macros || { carbs: 0, protein: 0, fat: 0 };
  const ingredients = result.ingredients || [];
  const preview = result.preview || "";

  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false); // ✅ 新增保存状态

  // ✅ 保存到今天（带 ingredients）
  const handleAdd = (kind: "breakfast" | "lunch" | "dinner" | "snack") => {
    if (saved) {
      alert("This food has already been saved!");
      return;
    }

    addTodayWithIngredients(dish, kcal, kind, macros, ingredients);
    alert(`${dish} added to ${kind}!`);
    setSaved(true);
    nav("/home");
  };

  return (
    <div className="phone-shell" style={{ paddingBottom: 120 }}>
      <div className="topbar">
        <div className="user">Scan Result</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        {/* ✅ 图片预览 */}
        {preview && (
          <img
            src={preview}
            alt={dish}
            style={{
              width: "100%",
              borderRadius: 16,
              objectFit: "contain",
              marginBottom: 12,
            }}
          />
        )}

        {/* ✅ 食物信息 */}
        <h3>{dish}</h3>
        <p style={{ marginTop: 4, color: "#64748b" }}>{kcal} kcal</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 16,
          }}
        >
          <div className="chip">
            <div>🥖 {macros.carbs ?? 0}g</div>
            <div className="muted">Carbs</div>
          </div>
          <div className="chip">
            <div>🍗 {macros.protein ?? 0}g</div>
            <div className="muted">Protein</div>
          </div>
          <div className="chip">
            <div>🥑 {macros.fat ?? 0}g</div>
            <div className="muted">Fat</div>
          </div>
        </div>

        {/* ✅ 食物组成 */}
        {ingredients.length > 0 && (
          <div style={{ marginTop: 18, textAlign: "left" }}>
            <b>Ingredients:</b>
            <ul style={{ marginTop: 6 }}>
              {ingredients.map((ing: any, i: number) => (
                <li key={i}>
                  {ing.name || ing} {ing.grams ? `- ${ing.grams}g` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ 添加到餐别 */}
        <div style={{ marginTop: 20 }}>
          {!showMenu ? (
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowMenu(true)}
            >
              {saved ? "✅ Saved" : "Add to meal"}
            </button>
          ) : (
            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              {["breakfast", "lunch", "dinner", "snack"].map((kind) => (
                <button
                  key={kind}
                  className="btn light"
                  onClick={() => handleAdd(kind as any)}
                >
                  ➕ Add to {kind}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

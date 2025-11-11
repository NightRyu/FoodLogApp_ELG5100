import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToday, MealKind, Macros } from "@/store/useMeals";
import BottomNav from "@/components/BottomNav";

type Food = {
  name: string;
  kcal: number;
  kind: MealKind;
  macros: Macros;
  ingredients?: { name: string; grams: number }[];
};

const samples: Food[] = [
  {
    name: "Breakfast platter",
    kcal: 653,
    kind: "breakfast",
    macros: { carbs: 50, protein: 30, fat: 25 },
    ingredients: [
      { name: "Egg", grams: 60 },
      { name: "Bacon", grams: 30 },
      { name: "Toast", grams: 40 },
    ],
  },
  {
    name: "Lunch platter",
    kcal: 780,
    kind: "lunch",
    macros: { carbs: 70, protein: 35, fat: 28 },
    ingredients: [
      { name: "Rice", grams: 120 },
      { name: "Chicken breast", grams: 100 },
      { name: "Vegetables", grams: 80 },
    ],
  },
  {
    name: "Dinner platter",
    kcal: 920,
    kind: "dinner",
    macros: { carbs: 85, protein: 40, fat: 35 },
    ingredients: [
      { name: "Pasta", grams: 130 },
      { name: "Beef steak", grams: 120 },
      { name: "Broccoli", grams: 60 },
    ],
  },
  {
    name: "Chicken Salad",
    kcal: 159,
    kind: "snack",
    macros: { carbs: 10, protein: 30, fat: 5 },
    ingredients: [
      { name: "Chicken breast", grams: 100 },
      { name: "Lettuce", grams: 40 },
      { name: "Olive oil", grams: 10 },
    ],
  },
];

const commons: Food[] = [
  {
    name: "Steak",
    kcal: 600,
    kind: "snack",
    macros: { carbs: 0, protein: 45, fat: 42 },
    ingredients: [
      { name: "Beef", grams: 150 },
      { name: "Butter", grams: 10 },
      { name: "Garlic", grams: 5 },
    ],
  },
  {
    name: "Salad",
    kcal: 180,
    kind: "snack",
    macros: { carbs: 12, protein: 6, fat: 10 },
    ingredients: [
      { name: "Lettuce", grams: 50 },
      { name: "Tomato", grams: 40 },
      { name: "Olive oil", grams: 10 },
    ],
  },
  {
    name: "Coke (330ml)",
    kcal: 140,
    kind: "snack",
    macros: { carbs: 35, protein: 0, fat: 0 },
    ingredients: [{ name: "Sugar water", grams: 330 }],
  },
  {
    name: "McDonald's Big Mac",
    kcal: 550,
    kind: "snack",
    macros: { carbs: 45, protein: 25, fat: 30 },
    ingredients: [
      { name: "Beef patty", grams: 80 },
      { name: "Bun", grams: 60 },
      { name: "Cheese", grams: 30 },
      { name: "Sauce", grams: 15 },
    ],
  },
];

export default function Search() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [addTo, setAddTo] = useState<MealKind>("snack");
  const [savedFoods, setSavedFoods] = useState<Food[]>([]);

  // ✅ 初始化加载保存的食物
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedFoods") || "[]");
    setSavedFoods(saved);
  }, []);

  // ✅ 删除保存的食物
  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = savedFoods.filter((f) => f.name !== name);
      localStorage.setItem("savedFoods", JSON.stringify(updated));
      setSavedFoods(updated);
      alert("Deleted successfully!");
    }
  };

  const filter = (arr: Food[]) =>
    arr.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase()));

  const Section = ({
    title,
    data,
    deletable = false, // ✅ 新增是否可删除标志
  }: {
    title: string;
    data: Food[];
    deletable?: boolean;
  }) => (
    <>
      <div className="section-title">{title}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {data.map((f) => (
          <div
            key={f.name}
            className="chip"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
              padding: "12px 14px",
            }}
          >
            <div>
              {/* ✅ 点击名称查看详情 */}
              <div
                className="meal-name"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() =>
                  nav("/food-detail", {
                    state: f,
                  })
                }
              >
                {f.name}
              </div>
              <div className="muted">{f.kcal} kcal · default: {f.kind}</div>
              <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <span>🥖 {f.macros.carbs}g</span>
                <span>🍗 {f.macros.protein}g</span>
                <span>🥑 {f.macros.fat}g</span>
              </div>
            </div>

            {/* ✅ 按钮组 */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="ghost"
                onClick={() => {
                  addToday(f.name, f.kcal, addTo, f.macros);
                  alert(`Added: ${f.name} · ${f.kcal} kcal → ${addTo}`);
                }}
              >
                Add
              </button>

              {/* ✅ 仅在 savedFoods 区块显示 Delete 按钮 */}
              {deletable && (
                <button
                  className="ghost"
                  style={{
                    background: "#fee2e2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca",
                  }}
                  onClick={() => handleDelete(f.name)}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      <div className="topbar">
        <div className="user">Search</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="card" style={{ marginBottom: 12, display: "grid", gap: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search foods..."
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            padding: "10px 12px",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="muted">Add to</span>
          <select
            value={addTo}
            onChange={(e) => setAddTo(e.target.value as MealKind)}
            style={{
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              padding: "8px 10px",
            }}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      <Section title="Sample platters" data={filter(samples)} />
      <Section title="Common foods" data={filter(commons)} />
      {savedFoods.length > 0 && (
        <Section title="Your saved foods" data={filter(savedFoods)} deletable />
      )}

      <BottomNav />
    </div>
  );
}

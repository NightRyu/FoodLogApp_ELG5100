import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Gauge from "@/components/Gauge";
import BottomNav from "@/components/BottomNav";
import {
  listToday,
  removeToday,
  totalKcal,
  totalMacros,
  MealKind,
} from "@/store/useMeals";
import { getProfile } from "@/store/useProfile";

type Group = {
  kind: MealKind;
  title: string;
};

const GROUPS: Group[] = [
  { kind: "breakfast", title: "Breakfast" },
  { kind: "lunch", title: "Lunch" },
  { kind: "dinner", title: "Dinner" },
  { kind: "snack", title: "Snack" },
];

export default function Home() {
  const nav = useNavigate();
  const [items, setItems] = useState(() => listToday());
  const [profile, setProfile] = useState(getProfile());

  useEffect(() => {
    setItems(listToday());
    setProfile(getProfile());
  }, []);

  const total = useMemo(() => totalKcal(items), [items]);
  const macros = useMemo(() => totalMacros(items), [items]);

  const macroChips = [
    { label: "Carbs", icon: "🥖", consumed: macros.carbs, target: profile.targetCarbs },
    { label: "Protein", icon: "🍗", consumed: macros.protein, target: profile.targetProtein },
    { label: "Fats", icon: "🥑", consumed: macros.fat, target: profile.targetFat },
  ];

  const refresh = () => setItems(listToday());

  return (
    <div className="phone-shell">
      {/* 顶部：问候 + 通知按钮 */}
      <div className="topbar">
        <div>
          <div className="muted">Good morning!</div>
          <div className="user">Lucas Tong</div>
        </div>
        <button
          aria-label="notifications"
          className="ghost"
          style={{ borderRadius: 12, padding: "6px 10px" }}
          onClick={() => alert("No new notifications")}
        >
          🔔
        </button>
      </div>

      {/* Search pill → 去 Search 页面 */}
      <div className="search-pill" onClick={() => nav("/search")}>
        Search food
      </div>

      {/* 仪表盘（上限 = 目标卡路里） */}
      <div className="card">
        <Gauge value={total || 0} max={profile.targetKcal} />
        <div className="gauge-value" style={{ top: "31.5%" }}>{total || 0}</div>
        <div
          style={{
            position: "relative",
            marginTop: -14,
            textAlign: "center",
            lineHeight: 1.12
          }}
        >
          <div className="muted" style={{ marginTop: 10 }}>Total Calories</div>
          <div className="muted" style={{ marginTop: 4 }}>
            Target: <b>{profile.targetKcal}</b> kcal
          </div>
        </div>
      </div>

      {/* 三大营养素 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginTop: 8,
          marginBottom: 6
        }}
      >
        {macroChips.map((c) => (
          <div
            key={c.label}
            className="chip"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              minWidth: 0,
              padding: "12px 12px"
            }}
          >
            <div className="chip-icon">{c.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div
                className="chip-value"
                style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}
              >
                {Math.round(c.consumed)}g/{c.target}g
              </div>
              <div className="muted">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 今日记录 */}
      <div className="section-title">Tracked today</div>
      {items.length === 0 ? (
        <div className="muted" style={{ marginBottom: 8 }}>
          No items yet. Tap “Search food” to add.
        </div>
      ) : (
        <div className="card" style={{ display: "grid", gap: 16 }}>
          {GROUPS.map((g) => {
            const rows = items.filter((it) => it.kind === g.kind);
            if (rows.length === 0) return null;
            const sum = rows.reduce((s, it) => s + it.kcal, 0);
            return (
              <div key={g.kind}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8
                }}>
                  <div style={{ fontWeight: 800 }}>{g.title}</div>
                  <div className="muted"><b>{sum}</b> Calories</div>
                </div>

                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {rows.map((it) => (
                    <li
                      key={it.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      <div>
                        {/* ✅ 点击食物名称进入 FoodDetail */}
                        <div
                          className="meal-name"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() =>
                            nav("/food-detail", {
                              state: {
                                name: it.name,
                                kcal: it.kcal,
                                macros: it.macros,
                                ingredients: it.ingredients || [
                                  { name: "Carbs", grams: it.macros?.carbs || 0 },
                                  { name: "Protein", grams: it.macros?.protein || 0 },
                                  { name: "Fat", grams: it.macros?.fat || 0 },
                                ],
                              },
                            })
                          }
                        >
                          {it.name}
                        </div>

                        <div className="muted">
                          {it.kcal} Calories · {it.kind}
                          {it.macros && (
                            <> · 🥖 {it.macros.carbs}g · 🍗 {it.macros.protein}g · 🥑 {it.macros.fat}g</>
                          )}
                        </div>
                      </div>

                      <button
                        className="ghost"
                        onClick={() => {
                          removeToday(it.id);
                          refresh();
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

import BottomNav from "@/components/BottomNav";
import { listToday, totalsByKind, totalKcal, lastNDays, dailyKcal } from "@/store/useMeals";
import { getProfile } from "@/store/useProfile";

export default function Analytics() {
  const items = listToday();
  const totals = totalsByKind(items);
  const total = totalKcal(items) || 1;

  const bars = [
    { label: "Breakfast", key: "breakfast", color: "#93c5fd" },
    { label: "Lunch", key: "lunch", color: "#60a5fa" },
    { label: "Dinner", key: "dinner", color: "#3b82f6" },
    { label: "Snacks", key: "snack", color: "#1d4ed8" },
  ] as const;

  const profile = getProfile();
  const days = lastNDays(7);
  const data7 = days.map((d) => ({
    date: d,
    actual: dailyKcal(d),
    target: profile.targetKcal,
  }));
  const maxY = Math.max(...data7.map((d) => Math.max(d.actual, d.target)), profile.targetKcal);

  const weekday = (iso: string) => {
    const dt = new Date(iso);
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()];
  };

  // ✅ 体重历史数据
  const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
  const maxW = Math.max(...weightHistory.map((r: any) => r.weight || 0), 1);
  const minW = Math.min(...weightHistory.map((r: any) => r.weight || maxW), maxW);

  return (
    <div className="phone-shell">
      <div className="topbar">
        <div className="user">Analytics</div>
      </div>

      {/* 今日分布 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Today</div>
        {bars.map((b) => {
          const val = totals[b.key];
          const pct = Math.round((val / total) * 100);
          return (
            <div key={b.key} style={{ margin: "8px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span className="muted">{b.label}</span>
                <span className="muted">{val} kcal · {pct}%</span>
              </div>
              <div style={{ height: 10, background: "#e5e7eb", borderRadius: 999 }}>
                <div
                  style={{
                    width: `${Math.max(4, pct)}%`,
                    height: 10,
                    background: b.color,
                    borderRadius: 999,
                    transition: "width .3s",
                  }}
                />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <strong style={{ fontSize: 18 }}>{total}</strong> kcal total
        </div>
      </div>

      {/* 过去7天热量 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Past 7 days</div>
        <div
          style={{
            height: 160,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 10,
            alignItems: "end",
          }}
        >
          {data7.map((d) => {
            const hActual = Math.round((d.actual / maxY) * 140) + 2;
            const hTarget = Math.round((d.target / maxY) * 140) + 2;
            return (
              <div key={d.date} style={{ display: "grid", gridTemplateRows: "1fr auto", gap: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, alignItems: "end" }}>
                  <div
                    title={`${d.actual} kcal`}
                    style={{ height: hActual, background: "#60a5fa", borderRadius: 6 }}
                  />
                  <div
                    title={`${d.target} kcal`}
                    style={{ height: hTarget, background: "#94a3b8", borderRadius: 6, opacity: 0.9 }}
                  />
                </div>
                <div style={{ textAlign: "center", fontSize: 12 }} className="muted">
                  {weekday(d.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

{/* Past 7 days weight */}
{(() => {
  const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
  if (!weightHistory.length) return null;

  const daysWeight = lastNDays(7).map((d) => {
    const rec = weightHistory.find((r: any) => r.date === d);
    return { date: d, weight: rec ? rec.weight : null };
  });

  // 只取有值的体重数据，用于计算最大最小差
  const weights = daysWeight.filter((d) => d.weight != null).map((d) => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = Math.max(maxW - minW, 0.1); // 防止除0

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Past 7 days weight</div>
      <div
        style={{
          height: 160,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
          alignItems: "end",
        }}
      >
        {daysWeight.map((d) => {
          if (d.weight == null)
            return (
              <div key={d.date} style={{ textAlign: "center", fontSize: 12 }}>
                <div
                  style={{
                    height: 4,
                    background: "#e5e7eb",
                    borderRadius: 6,
                    opacity: 0.4,
                  }}
                />
                <div className="muted">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(d.date).getDay()]}</div>
              </div>
            );

          // 让体重变化差异放大显示（线性放大 3 倍）
          const h = 60 + ((d.weight - minW) / range) * 60;


          return (
            <div key={d.date} style={{ textAlign: "center", position: "relative" }}>
              {/* 体重数字 */}
              <div
                style={{
                  position: "absolute",
                  bottom: h + 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 11,
                  color: "#475569",
                }}
              >
                {d.weight.toFixed(1)}kg
              </div>

              {/* 柱状条 */}
              <div
                style={{
                  height: h,
                  background: "#f97316",
                  borderRadius: 6,
                  transition: "height .3s ease",
                }}
              />

              {/* 星期 */}
              <div style={{ marginTop: 6, fontSize: 12 }} className="muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(d.date).getDay()]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
          fontSize: 12,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            background: "#f97316",
            borderRadius: 2,
          }}
        />
        Weight trend (kg)
      </div>
    </div>
  );
})()}


      <BottomNav />
    </div>
  );
}

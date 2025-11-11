import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { getProfile, saveProfile } from "@/store/useProfile";

/** ✅ BMR 估算公式（Mifflin-St Jeor） */
function estimateCalories(height: number, weight: number) {
  if (!height || !weight) return 0;
  const BMR = 10 * weight + 6.25 * height - 5 * 25 + 5; // 假设25岁男性
  return Math.round(BMR * 1.4); // 轻度活动系数
}

const inputStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  outline: "none",
  fontSize: 16,
} as const;

const Field = React.memo(function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="muted" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          autoComplete="off"
          spellCheck={false}
          style={inputStyle}
        />
        {suffix && (
          <span
            className="muted"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
});

export default function ProfilePage() {
  const nav = useNavigate();

  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [kcal, setKcal] = useState<string>("");
  const [carb, setCarb] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [fat, setFat] = useState<string>("");

  const [estKcal, setEstKcal] = useState<number>(0);

  useEffect(() => {
    const p = getProfile();
    setHeight(p.height != null ? String(p.height) : "");
    setWeight(p.weight != null ? String(p.weight) : "");
    setKcal(String(p.targetKcal ?? 2000));
    setCarb(String(p.targetCarbs ?? 83));
    setProtein(String(p.targetProtein ?? 95));
    setFat(String(p.targetFat ?? 72));
  }, []);

  // 当用户输入身高/体重时自动估算热量
  useEffect(() => {
    const h = Number(height);
    const w = Number(weight);
    if (h > 0 && w > 0) {
      setEstKcal(estimateCalories(h, w));
    } else {
      setEstKcal(0);
    }
  }, [height, weight]);

  const toNumber = (s: string, fallback = 0) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  };

  const onSave = () => {
    const next = {
      height: height.trim() ? toNumber(height) : undefined,
      weight: weight.trim() ? toNumber(weight) : undefined,
      targetKcal: Math.max(0, toNumber(kcal || String(estKcal) || "2000")),
      targetCarbs: Math.max(0, toNumber(carb, 83)),
      targetProtein: Math.max(0, toNumber(protein, 95)),
      targetFat: Math.max(0, toNumber(fat, 72)),
    };
    saveProfile(next);

    // ✅ 保存体重历史（过去7天数据）
    const log = JSON.parse(localStorage.getItem("weightHistory") || "[]");
    const today = new Date().toISOString().split("T")[0];
    const newLog = [
      ...log.filter((r: any) => r.date !== today),
      { date: today, weight: toNumber(weight) },
    ].slice(-7);
    localStorage.setItem("weightHistory", JSON.stringify(newLog));

    alert("✅ Profile saved!");
    nav(-1);
  };

  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <div className="user">Profile</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      {/* 基本信息 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <Field label="Height (optional)" value={height} onChange={setHeight} suffix="cm" />
        <Field label="Weight (optional)" value={weight} onChange={setWeight} suffix="kg" />

        {estKcal > 0 && (
          <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>
            🔹 Estimated Calories: <strong>{estKcal}</strong> kcal/day
          </div>
        )}
      </div>

      {/* 目标设置 */}
      <div className="card">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Daily Targets</div>
        <Field label="Calories" value={kcal} onChange={setKcal} suffix="kcal" />
        <Field label="Carbs" value={carb} onChange={setCarb} suffix="g" />
        <Field label="Protein" value={protein} onChange={setProtein} suffix="g" />
        <Field label="Fats" value={fat} onChange={setFat} suffix="g" />

        <button className="primary-btn" style={{ marginTop: 8 }} onClick={onSave}>
          Save
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

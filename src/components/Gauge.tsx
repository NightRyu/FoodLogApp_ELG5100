type Props = { value: number; max?: number };
export default function Gauge({ value, max = 2500 }: Props) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ width: "100%", aspectRatio: "2 / 1", position: "relative" }}>
      <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%" }}>
        <path d="M5,50 A45,45 0 0,1 95,50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <path
          d="M5,50 A45,45 0 0,1 95,50"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ strokeDasharray: 141, strokeDashoffset: 141 * (1 - pct) }}
        />
      </svg>
      {/* 无指针 */}
    </div>
  );
}

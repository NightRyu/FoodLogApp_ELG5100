import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="phone-shell">
      <div className="hero-circles" />
      <div style={{ padding: 24, marginTop: 280 }}>
        <h1 className="big-title">Smarter Calorie{"\n"}Tracking</h1>
        <button className="primary-btn" onClick={() => nav("/home")}>
          Get started
        </button>
      </div>
    </div>
  );
}

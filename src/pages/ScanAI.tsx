// src/pages/ScanAI.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function ScanAI() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleScan = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("http://localhost:8787/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();
      if (!data || data.error) {
        alert("Scan failed: " + (data.error || "Unknown error"));
        return;
      }

      // ✅ 跳转时带上完整 ingredients
      nav("/ai-result", {
        state: {
          name: data.name,
          kcal: data.kcal,
          macros: data.macros,
          ingredients: data.ingredients || [],
          preview: URL.createObjectURL(file),
        },
      });
    } catch (err) {
      alert("Scan failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCamera = () => {
    alert("📸 Camera mode coming soon!");
  };

  return (
    <div className="phone-shell" style={{ paddingBottom: 96 }}>
      <div className="topbar">
        <div className="user">AI Scanning</div>
        <button className="ghost" onClick={() => nav(-1)}>Back</button>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        {/* ✅ 上传后显示预览图 */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{
              width: "100%",
              borderRadius: 16,
              marginBottom: 14,
              objectFit: "contain",
              maxHeight: 300,
            }}
          />
        )}

        {/* ✅ 上传框 */}
        {!file && (
          <div className="upload-box" style={{ marginBottom: 12 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        {/* ✅ 按钮 */}
        <button
          className="btn-primary"
          disabled={loading}
          onClick={handleScan}
          style={{ marginTop: 4 }}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>

        <button
          className="btn light"
          onClick={handleCamera}
          style={{ marginTop: 10, width: "100%" }}
        >
          📷 Use camera
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

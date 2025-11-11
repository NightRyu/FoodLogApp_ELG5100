import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import ScanAI from "@/pages/ScanAI";
import ScanResultPage from "@/pages/ScanResult";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/ai-scan" element={<ScanAI />} />
      <Route path="/ai-result" element={<ScanResultPage />} />
    </Routes>
  );
}

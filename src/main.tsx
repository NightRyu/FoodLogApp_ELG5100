import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./App.css";

import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import ScanAI from "@/pages/ScanAI";
import ScanResult from "@/pages/ScanResult";
import FoodDetail from "@/pages/FoodDetail"; // ✅ 新增

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },
  { path: "/home", element: <Home /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/profile", element: <Profile /> },
  { path: "/search", element: <Search /> },
  { path: "/ai-scan", element: <ScanAI /> },
  { path: "/ai-result", element: <ScanResult /> },
  { path: "/food-detail", element: <FoodDetail /> }, // ✅ 新增路由
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

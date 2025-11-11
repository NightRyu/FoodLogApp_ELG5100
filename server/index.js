// server/index.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// ========== 环境变量加载 ==========
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env (should be at project root)");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ========== Prompt 模板 ==========
const SYSTEM_PROMPT = `
You are a professional nutritionist and food recognition expert.

Given a food photo, identify:
- The food's **name**.
- List of ingredients and their estimated grams.
- Estimated total calories.
- Estimated macronutrients (carbs, protein, fat) in grams.

Output only a JSON object with this structure:
{
  "name": "Chicken Salad",
  "ingredients": [
    {"name": "chicken breast", "grams": 120},
    {"name": "lettuce", "grams": 50},
    {"name": "tomato", "grams": 30}
  ],
  "kcal": 480,
  "macros": {"carbs": 20, "protein": 40, "fat": 18}
}
Return no extra text or explanations.
`;

// ========== 路由 ==========
app.get("/", (req, res) => {
  res.send("✅ AI Scanning Server Running. Use POST /api/scan");
});

app.post("/api/scan", async (req, res) => {
  console.log("\n📸 [SCAN REQUEST] received at", new Date().toLocaleTimeString());
  try {
    const { imageBase64, mealKind } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request" });
    }

    // 兼容 dataURL / base64
    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    // ========== 调用 OpenAI ==========
    console.log("🧠 Sending image to OpenAI for analysis...");
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "input_text", text: "Analyze this food photo and respond with JSON only." },
            { type: "input_image", image_url: dataUrl },
          ],
        },
      ],
    });

    // ========== 提取模型输出 ==========
    const txt =
      response?.output?.[0]?.content?.[0]?.text ??
      response?.output_text ??
      "";

    console.log("📝 Raw model output:");
    console.log(txt.slice(0, 500)); // 打印前 500 字符方便调试

    // ========== 尝试解析 JSON ==========
    let parsed;
    try {
      const clean = txt.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (err) {
      const match = txt.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        console.warn("⚠️ JSON parse failed, using fallback demo result.");
        parsed = null;
      }
    }

    // ========== 构造返回结果 ==========
    const result = parsed
      ? {
          name: parsed.name || "Unknown Dish",
          ingredients: parsed.ingredients || [],
          kcal: parsed.kcal || 0,
          macros: parsed.macros || { carbs: 0, protein: 0, fat: 0 },
          mealKind: mealKind || "snack",
          imageUsed: true,
        }
      : {
          // fallback demo
          name: "Chicken Salad",
          ingredients: [
            { name: "chicken breast", grams: 120 },
            { name: "lettuce", grams: 50 },
            { name: "tomato", grams: 30 },
          ],
          kcal: 480,
          macros: { carbs: 20, protein: 40, fat: 18 },
          mealKind: mealKind || "snack",
          imageUsed: false,
        };

    console.log("✅ [SCAN RESULT]", result.name, "-", result.kcal, "kcal");
    res.json(result);
  } catch (err) {
    console.error("❌ [SCAN ERROR]", err);
    res.status(500).json({
      error: "scan_failed",
      message: err.message,
      demo: {
        name: "Chicken Salad",
        ingredients: [
          { name: "chicken breast", grams: 120 },
          { name: "lettuce", grams: 50 },
          { name: "tomato", grams: 30 },
        ],
        kcal: 480,
        macros: { carbs: 20, protein: 40, fat: 18 },
        imageUsed: false,
      },
    });
  }
});

// ========== 启动服务器 ==========
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

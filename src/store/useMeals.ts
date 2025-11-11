// src/store/useMeals.ts

export type MealKind = "breakfast" | "lunch" | "dinner" | "snack";

export type Macros = {
  carbs: number;   // g
  protein: number; // g
  fat: number;     // g
};

// ✅ 新增：食材组成类型
export type Ingredient = {
  name: string;
  grams: number;
};

// ✅ 修改：为 MealItem 增加 ingredients 可选字段
export type MealItem = {
  id: string;
  name: string;
  kcal: number;
  kind: MealKind;     // 用户选择的餐别
  macros?: Macros;
  ingredients?: Ingredient[];  // ✅ 可选字段（兼容旧数据）
  ts: number;         // 时间戳（ms）
};

const KEY = "vbm_today_meals";

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

function load(): MealItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MealItem[]) : [];
  } catch {
    return [];
  }
}

function save(arr: MealItem[]) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function sameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(ts: number) {
  return sameDate(new Date(ts), new Date());
}

function dateKeyISO(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateKeyFromTs(ts: number) {
  return dateKeyISO(new Date(ts));
}

/** ✅ 只取今天 */
export function listToday(): MealItem[] {
  return load().filter((m) => isToday(m.ts));
}

/** ✅ 新增一条记录（写入所选餐别 kind） */
export function addToday(
  name: string,
  kcal: number,
  kind: MealKind,
  macros?: Macros
) {
  const arr = load();
  arr.push({
    id: uid(),
    name,
    kcal,
    kind,
    macros,
    ts: Date.now(),
  });
  save(arr);
}

/** ✅ 新增：带 ingredients 的添加函数 */
export function addTodayWithIngredients(
  name: string,
  kcal: number,
  kind: MealKind,
  macros: Macros,
  ingredients: Ingredient[]
) {
  const arr = load();
  arr.push({
    id: uid(),
    name,
    kcal,
    kind,
    macros,
    ingredients,
    ts: Date.now(),
  });
  save(arr);
}

/** ✅ 删除一条记录（按 id） */
export function removeToday(id: string) {
  const arr = load();
  save(arr.filter((m) => m.id !== id));
}

/** ✅ 今日总热量 */
export function totalKcal(items: MealItem[]) {
  return items.reduce((s, i) => s + i.kcal, 0);
}

/** ✅ 今日宏量营养素合计 */
export function totalMacros(items: MealItem[]) {
  return items.reduce(
    (acc, i) => {
      if (i.macros) {
        acc.carbs += i.macros.carbs || 0;
        acc.protein += i.macros.protein || 0;
        acc.fat += i.macros.fat || 0;
      }
      return acc;
    },
    { carbs: 0, protein: 0, fat: 0 }
  );
}

/** ✅ 今日各餐别热量分布（给 Analytics 用） */
export function totalsByKind(items: MealItem[]) {
  const base = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 } as Record<
    MealKind,
    number
  >;
  for (const it of items) {
    base[it.kind] += it.kcal;
  }
  return base;
}

/** ✅ 返回过去 n 天的日期（含今天），格式 YYYY-MM-DD，按时间从旧到新 */
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(dateKeyISO(d));
  }
  return out;
}

/** ✅ 指定某天（YYYY-MM-DD）的总热量 */
export function dailyKcal(isoDate: string): number {
  const all = load();
  return all
    .filter((m) => dateKeyFromTs(m.ts) === isoDate)
    .reduce((s, m) => s + m.kcal, 0);
}

/** ✅ 删除指定食物（通过 id） */
export function removeSavedFood(id: string) {
  const arr = load();
  const filtered = arr.filter((item) => item.id !== id);
  save(filtered);
}

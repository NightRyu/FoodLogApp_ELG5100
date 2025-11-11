// 简单本地存储版 Profile
export type Profile = {
  height?: number;
  weight?: number;
  targetKcal: number;
  targetCarbs: number;
  targetProtein: number;
  targetFat: number;
};

const KEY = "vbm_profile";

const DEFAULT_PROFILE: Profile = {
  height: 175,
  weight: 65,
  targetKcal: 2200,
  targetCarbs: 83,
  targetProtein: 95,
  targetFat: 72,
};

export function getProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

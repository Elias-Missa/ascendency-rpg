// XP and Level calculation utilities

export const XP_PER_LEVEL = 100;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpForCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function getXpProgress(xp: number): number {
  return (getXpForCurrentLevel(xp) / XP_PER_LEVEL) * 100;
}

export function getXpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - getXpForCurrentLevel(xp);
}

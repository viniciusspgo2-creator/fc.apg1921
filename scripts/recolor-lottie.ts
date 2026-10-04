/**
 * One-off build script (Fase 6): snaps every Lottie color to the
 * official FC APG 1921 palette (brief §3.2/§10).
 * Usage: bun scripts/recolor-lottie.ts
 */
import { readFileSync, writeFileSync } from "node:fs";

const PALETTE: [number, number, number][] = [
  [0, 82, 168], // apg-blue
  [0, 43, 92], // apg-blue-deep
  [248, 224, 16], // apg-yellow
  [3, 167, 94], // apg-green
  [223, 6, 41], // apg-red
  [255, 255, 255], // paper
  [244, 246, 250], // paper-soft
  [7, 10, 18], // ink
];

const nearest = (r: number, g: number, b: number) => {
  let best = PALETTE[0];
  let bestD = Infinity;
  for (const p of PALETTE) {
    const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
};

const walk = (node: unknown): void => {
  if (Array.isArray(node)) {
    // Lottie color array: [r, g, b] or [r, g, b, a], 0-1 floats.
    if (
      node.length >= 3 &&
      node.length <= 4 &&
      node.every((v) => typeof v === "number") &&
      node.slice(0, 3).every((v) => v >= 0 && v <= 1)
    ) {
      const [r, g, b] = node;
      const snapped = nearest(
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
      );
      node[0] = Number((snapped[0] / 255).toFixed(4));
      node[1] = Number((snapped[1] / 255).toFixed(4));
      node[2] = Number((snapped[2] / 255).toFixed(4));
      return;
    }
    node.forEach(walk);
    return;
  }
  if (node && typeof node === "object") {
    Object.values(node as Record<string, unknown>).forEach(walk);
  }
};

for (const file of [
  "public/lottie/balancing-football.json",
  "public/lottie/soccer-player-kick.json",
]) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  walk(data);
  writeFileSync(file, JSON.stringify(data));
  console.log(`recolor ok → ${file}`);
}

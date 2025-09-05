import { rgbaToHex } from "@/lib/math/colors";
import type { HSV, RGBA } from "@/types";

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

function hsvToRgb({ h, s, v }: HSV): RGBA {
  const sNorm = s / 100;
  const vNorm = v / 100;
  const C = vNorm * sNorm;
  const H_prime = (((h % 360) + 360) % 360) / 60; // normalize
  const X = C * (1 - Math.abs((H_prime % 2) - 1));
  let [r1, g1, b1] = [0, 0, 0];

  if (H_prime < 1) [r1, g1, b1] = [C, X, 0];
  else if (H_prime < 2) [r1, g1, b1] = [X, C, 0];
  else if (H_prime < 3) [r1, g1, b1] = [0, C, X];
  else if (H_prime < 4) [r1, g1, b1] = [0, X, C];
  else if (H_prime < 5) [r1, g1, b1] = [X, 0, C];
  else [r1, g1, b1] = [C, 0, X];

  const m = vNorm - C;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export interface Input {
  x: number; // 0–1
  y: number; // 0–1
  h: number; // hue 0–360
  a?: number; // alpha 0–1
}

export function paletteCoordsToColor({ x, y, h, a = 1 }: Input): {
  hex: string;
  alpha: number;
} {
  const s = x * 100;
  const v = (1 - y) * 100;

  const { r, g, b } = hsvToRgb({ h, s, v });
  const hex = rgbaToHex({ r, g, b, a });

  return { hex, alpha: a };
}

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

function parseHexColor(hex: string): RGBA {
  hex = hex.replace(/^#/, "").toLowerCase();
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255;
  } else {
    throw new Error("Invalid hex");
  }
  return { r, g, b, a };
}

function rgbToHsv(rgb: RGBA): HSV {
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s: s * 100, v: v * 100 };
}

export type PaletteResult = {
  x: number;
  y: number;
  a: number;
  h: number;
};

export function getPaletteCoordsFromHex(hex: string): PaletteResult {
  const { r, g, b, a = 1 } = parseHexColor(hex);
  const hsv = rgbToHsv({ r, g, b });
  const x = hsv.s / 100;
  const y = 1 - hsv.v / 100;
  return { x, y, a, h: hsv.h };
}

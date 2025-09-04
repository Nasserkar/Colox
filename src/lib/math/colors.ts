import type { HSLA, RGBA } from "@/types";
import { clamp } from "@/lib/math/utils";

export const rgbaToHex = ({ r, g, b, a = 1 }: Partial<RGBA>): string => {
  const clamp = (v: number, max = 255) =>
    Math.max(0, Math.min(max, Math.round(v)));

  const rHex = clamp(r ?? 0)
    .toString(16)
    .padStart(2, "0");
  const gHex = clamp(g ?? 0)
    .toString(16)
    .padStart(2, "0");
  const bHex = clamp(b ?? 0)
    .toString(16)
    .padStart(2, "0");
  const aHex = clamp(a * 255, 255)
    .toString(16)
    .padStart(2, "0");

  return a < 1 ? `#${rHex}${gHex}${bHex}${aHex}` : `#${rHex}${gHex}${bHex}`;
};

export const hslaToHex = ({ h, s, l, a = 1 }: Partial<HSLA>): string => {
  // Clamp values
  h = (((h ?? 0) % 360) + 360) % 360; // wrap hue around 0-360
  s = clamp(s ?? 0, 0, 100) / 100;
  l = clamp(l ?? 0, 0, 100) / 100;
  a = clamp(a, 0, 1);

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  // Convert to 0-255
  r = clamp((r + m) * 255, 0, 255);
  g = clamp((g + m) * 255, 0, 255);
  b = clamp((b + m) * 255, 0, 255);

  return rgbaToHex({ r, g, b, a });
};

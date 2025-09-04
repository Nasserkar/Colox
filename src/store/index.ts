import type { POS } from "@/types";
import { create } from "zustand";

type SliderState = {
  setX: (newX: number) => void;
  setY: (newY: number) => void;
  size: number;
  setSize: (newSize: number) => void;
  bg: string;
  setBg: (newBg: string) => void;
} & POS;

type SliderBoxState = {
  height: number;
  setHeight: (newHeight: number) => void;
  width: number;
  setWidth: (newWidth: number) => void;
};

export const useSlider = create<SliderState>()((set) => ({
  x: 240,
  setX: (x) => set({ x }),
  y: 0,
  setY: (y) => set({ y }),
  size: 12,
  setSize: (size) => set({ size }),
  bg: "#ff0000",
  setBg: (bg) => set({ bg }),
}));

export const useSliderBox = create<SliderBoxState>()((set) => ({
  height: 200,
  setHeight: (height) => set({ height }),
  width: 240,
  setWidth: (height) => set({ height }),
}));

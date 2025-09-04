import { clamp } from "@/lib/math/utils";
import { useSlider, useSliderBox } from "@/store";
import { useCallback, useLayoutEffect, useRef } from "react";

function ColorCanvas() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);

  const size = useSlider((state) => state?.size);
  const setSize = useSlider((state) => state?.setSize);
  const sX = useSlider((state) => state?.x);
  const setX = useSlider((state) => state?.setX);
  const sY = useSlider((state) => state?.y);
  const setY = useSlider((state) => state?.setY);
  const sBg = useSlider((state) => state?.bg);

  const boxHeight = useSliderBox((state) => state?.height);
  const setBoxHeight = useSliderBox((state) => state?.setHeight);
  const boxWidth = useSliderBox((state) => state?.width);
  const setBoxWidth = useSliderBox((state) => state?.setWidth);

  useLayoutEffect(() => {
    if (sliderRef?.current) {
      const s = sliderRef.current?.getBoundingClientRect().width;
      setSize(s);
    }
  }, [setSize]);

  useLayoutEffect(() => {
    if (sliderBoxRef?.current) {
      const width = sliderBoxRef.current?.getBoundingClientRect().width;
      const height = sliderBoxRef.current?.getBoundingClientRect().height;

      setBoxWidth(width);
      setBoxHeight(height);
    }
  }, [setBoxWidth, setBoxHeight]);

  const move = useCallback(
    (clientX: number, clientY: number) => {
      const rect = sliderBoxRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = clamp(clientX - rect.left, 0, boxWidth);
      const y = clamp(clientY - rect.top, 0, boxHeight);

      requestAnimationFrame(() => {
        setX(x);
        setY(y);
      });
    },
    [boxWidth, boxHeight, setX, setY]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      move(e.clientX, e.clientY);
    },
    [move]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current) {
        move(e.clientX, e.clientY);
      }
    },
    [move]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = false;
  }, []);

  return (
    <div
      id="color-canvas"
      className="w-full h-50 flex items-center justify-center relative my-4 hue-overlay"
      style={{
        backgroundColor: "#ff0000",
      }}
    >
      <div id="light-overlay" className="absolute inset-0 white-overlay">
        <div
          id="black-overlay"
          className="absolute inset-0 black-overlay"
        ></div>
      </div>
      <div
        id="slider-box"
        ref={sliderBoxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-full w-full"
      >
        <div
          id="slider"
          ref={sliderRef}
          draggable={false}
          className="slider absolute size-3 box-content border-2 border-white"
          style={{
            transform: `translate3d(${sX - size / 2}px, ${sY - size / 2}px, 1px)`,
            backgroundColor: sBg,
          }}
        ></div>
      </div>
    </div>
  );
}

function ColorPicker() {
  return (
    <div id="color-picker" className="min-h-40 w-60 bg-black flex flex-col">
      <ColorCanvas />
    </div>
  );
}

export { ColorPicker };

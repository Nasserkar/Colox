import { Input } from "@/components/ui/input";
import { Slider, SliderThumb } from "@/components/ui/slider";
import { hslaToHex } from "@/lib/math/colors";
import {
  clamp,
  getPaletteCoordsFromHex,
  paletteCoordsToColor,
} from "@/lib/math/utils";
import { useColorPicker, useSlider, useSliderBox } from "@/store";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const ColorCanvas = memo(() => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);

  const hue = useColorPicker((state) => state?.hue);
  const alpha = useColorPicker((state) => state?.alpha);
  const setColor = useColorPicker((state) => state?.setColor);

  const size = useSlider((state) => state?.size);
  const setSize = useSlider((state) => state?.setSize);
  const sX = useSlider((state) => state?.x);
  const setX = useSlider((state) => state?.setX);
  const sY = useSlider((state) => state?.y);
  const setY = useSlider((state) => state?.setY);
  const sBg = useSlider((state) => state?.bg);
  const setSliderBg = useSlider((state) => state?.setBg);

  const boxHeight = useSliderBox((state) => state?.height);
  const setBoxHeight = useSliderBox((state) => state?.setHeight);
  const boxWidth = useSliderBox((state) => state?.width);
  const setBoxWidth = useSliderBox((state) => state?.setWidth);
  const boxBg = useSliderBox((state) => state?.bg);
  const setBoxBg = useSliderBox((state) => state?.setBg);

  useEffect(() => {
    const w = paletteCoordsToColor({
      x: sX / boxWidth,
      y: sY / boxHeight,
      h: hue,
    });

    setSliderBg(w.hex);

    const rc = paletteCoordsToColor({
      x: sX / boxWidth,
      y: sY / boxHeight,
      h: hue,
      a: alpha / 100,
    });

    setColor(rc.hex);
  }, [hue, alpha, sX, sY, boxWidth, boxHeight, setSliderBg, setColor]);

  useEffect(() => {
    setBoxBg(hslaToHex({ h: hue, s: 100, l: 50, a: 1 }));
  }, [setBoxBg, hue]);

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
        backgroundColor: boxBg,
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
});

const HueSlider = memo(() => {
  const hue = useColorPicker((state) => state?.hue);
  const setHue = useColorPicker((state) => state?.setHue);

  const handleHueInput = useCallback(
    (e: number[]) => {
      setHue(e[0]);
    },
    [setHue]
  );

  return (
    <div className="bg-rainbow">
      <Slider
        defaultValue={[0]}
        value={[hue]}
        max={360}
        step={1}
        className="h-2.5"
        onValueChange={handleHueInput}
      >
        <SliderThumb
          className="box-content size-3 rounded-none"
          style={{
            backgroundColor: hslaToHex({ h: hue, s: 100, l: 50, a: 1 }),
          }}
        />
      </Slider>
    </div>
  );
});

const AlphaSlider = memo(() => {
  const hue = useColorPicker((state) => state?.hue);
  const alpha = useColorPicker((state) => state?.alpha);
  const setAlpha = useColorPicker((state) => state?.setAlpha);

  return (
    <div className="bg-alpha">
      <Slider
        defaultValue={[100]}
        value={[alpha]}
        max={100}
        step={1}
        className="h-2.5"
        onValueChange={(e) => setAlpha(e[0])}
        style={{
          background: `linear-gradient( to right, transparent 0%,${hslaToHex({ h: hue, s: 100, l: 50, a: 1 })} 100%)`,
        }}
      >
        <SliderThumb
          className="box-content size-3 rounded-none"
          style={{
            background: `${hslaToHex({ h: hue, s: 100, l: 50, a: alpha / 100 })}`,
          }}
        />
      </Slider>
    </div>
  );
});

const ColorInput = memo(() => {
  const [text, setText] = useState<string>("#ff0000");

  const color = useColorPicker((state) => state?.color);
  const setHue = useColorPicker((state) => state?.setHue);
  const setAlpha = useColorPicker((state) => state?.setAlpha);

  const setX = useSlider((state) => state?.setX);
  const setY = useSlider((state) => state?.setY);

  const boxHeight = useSliderBox((state) => state?.height);
  const boxWidth = useSliderBox((state) => state?.width);

  useEffect(() => {
    setText(color);
  }, [color]);

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target?.value);
    },
    []
  );

  const applyColorFromText = useCallback(
    (value: string) => {
      let v = value;

      if (v.trim() === "") {
        v = "#ff0000";
        setText(v);
      }

      const { x, y, a, h } = getPaletteCoordsFromHex(v);

      const nx = x * boxWidth;
      const ny = y * boxHeight;
      const na = a * 100;
      const nh = h;

      setX(nx);
      setY(ny);
      setHue(nh);
      setAlpha(na);
    },
    [setAlpha, setHue, setX, setY, boxWidth, boxHeight]
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      applyColorFromText(e.target.value);
    },
    [applyColorFromText]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        applyColorFromText(e.currentTarget.value);
      }
    },
    [applyColorFromText]
  );

  return (
    <Input
      variant={"lg"}
      type="text"
      id="color-input"
      name="color-input"
      autoCorrect="off"
      autoComplete="off"
      autoCapitalize="off"
      minLength={0}
      maxLength={9}
      className="bg-white/10 uppercase text-purple-200 border-transparent text-sm font-medium leading-4 lining-nums tabular-nums"
      value={text}
      onChange={handleColorInput}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
    />
  );
});

export const ColorPicker = memo(() => {
  return (
    <div id="color-picker" className="min-h-40 w-60 bg-dark-100 flex flex-col">
      <ColorCanvas />
      <div className="flex flex-col gap-4 px-4">
        <div>
          <HueSlider />
        </div>
        <div>
          <AlphaSlider />
        </div>
      </div>
      <div className="px-4 pb-4 mt-6">
        <ColorInput />
      </div>
    </div>
  );
});

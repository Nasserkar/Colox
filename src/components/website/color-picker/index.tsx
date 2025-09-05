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
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function ColorCanvas() {
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
}

function ColorInput() {
  const [text, setText] = useState<string>("#ff0000");

  const color = useColorPicker((state) => state?.color);
  const setHue = useColorPicker((state) => state?.setHue);
  const setAlpha = useColorPicker((state) => state?.setAlpha);
  const setX = useSlider((state) => state?.setX);
  const setY = useSlider((state) => state?.setY);

  useEffect(() => {
    setText(color);
  }, [color]);

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target?.value);
    },
    []
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const v = e?.target?.value;

      const { x, y, a, h } = getPaletteCoordsFromHex(v);

      const nx = x * 240;
      const ny = y * 200;
      const na = a * 100;
      const nh = h;

      setX(nx);
      setY(ny);
      setHue(nh);
      setAlpha(na);

      console.log(na);
    },
    [setAlpha, setHue, setX, setY]
  );

  return (
    <div className="px-4 py-2">
      <Input
        type="text"
        id="color-input"
        name="color-input"
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        className="bg-white/10 text-purple-200 font-medium"
        value={text}
        onChange={handleColorInput}
        onBlur={handleInputBlur}
      />
    </div>
  );
}

function ColorPicker() {
  const hue = useColorPicker((state) => state?.hue);
  const setHue = useColorPicker((state) => state?.setHue);
  const alpha = useColorPicker((state) => state?.alpha);
  const setAlpha = useColorPicker((state) => state?.setAlpha);

  const setBoxBg = useSliderBox((state) => state?.setBg);

  const handleHueInput = useCallback(
    (e: number[]) => {
      setHue(e[0]);
      setBoxBg(hslaToHex({ h: hue, s: 100, l: 50, a: 1 }));
    },
    [setHue, setBoxBg, hue]
  );

  return (
    <div id="color-picker" className="min-h-40 w-60 bg-black flex flex-col">
      <ColorCanvas />
      <div className="px-4 py-2">
        <Slider
          defaultValue={[0]}
          value={[hue]}
          max={360}
          step={1}
          className="bg-rainbow h-2.5 rounded-2xl"
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
      <div className="px-4 py-2">
        <div className="alpha-bg">
          <Slider
            defaultValue={[100]}
            value={[alpha]}
            max={100}
            step={1}
            className="h-2.5 rounded-2xl"
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
      </div>
      <ColorInput />
    </div>
  );
}

export { ColorPicker };

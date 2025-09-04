function ColorCanvas() {
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
      <div id="slider-box" className="relative h-full w-full">
        <div
          id="slider"
          className="slider absolute size-3 box-content border-2 border-white"
          style={{
            backgroundColor: "#ffffff",
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

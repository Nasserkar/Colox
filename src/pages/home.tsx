import { ColorPicker } from "@/components/website/color-picker";
import { useColorPicker } from "@/store";
import { useEffect } from "react";

function Home() {
  const color = useColorPicker((state) => state.color);

  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return (
    <>
      <section className="min-h-screen w-full flex items-center justify-center">
        <ColorPicker />
      </section>
    </>
  );
}

export default Home;

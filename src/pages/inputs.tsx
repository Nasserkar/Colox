import { NumInput } from "@/components/website/color-picker/input";
import { useState } from "react";

function Inputs() {
  const [num, setNum] = useState<number>(100);
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center">
      <p>{num}</p>
      <NumInput
        name="size"
        id="size"
        className="w-20"
        value={num}
        defaultValue={num}
        onValueChange={setNum}
      />
    </section>
  );
}

export default Inputs;

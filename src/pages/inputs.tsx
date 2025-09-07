import { NumInput } from "@/components/website/color-picker/input";
import React, { useCallback, useState } from "react";

function Inputs() {
  const [text, setText] = useState<string>("100");
  const [prevText, setPrevText] = useState<string>("100");
  const [num, setNum] = useState<null | undefined | number>(0);

  const applyValue = useCallback(
    (e: string) => {
      if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(e)) {
        setText(e);
        setPrevText(e);
        setNum(Number(e));
      } else {
        setText(prevText);
        setNum(Number(prevText));
      }
    },
    [prevText]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      applyValue(e?.target.value);
    },
    [applyValue]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e?.target?.value;
    setText(input);
  }, []);

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        applyValue(e.currentTarget.value);
      }
    },
    [applyValue]
  );

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center">
      <p>{num}</p>
      <NumInput
        name="size"
        id="size"
        className="w-20"
        value={text}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />
    </section>
  );
}

export default Inputs;

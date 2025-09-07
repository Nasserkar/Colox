import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

type NumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  value?: number; // Current numeric value
  defaultValue?: number; // Optional initial value
  onValueChange?: (val: number) => void; // Fired when a valid number is applied
};

function NumInput({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: NumberInputProps) {
  const [text, setText] = useState<string>(
    value !== undefined ? String(value) : String(defaultValue)
  );
  const [prevText, setPrevText] = useState<string>(text);

  const applyValue = useCallback(
    (raw: string) => {
      if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)) {
        setText(raw);
        setPrevText(raw);
        onValueChange?.(Number(raw));
      } else {
        // revert to previous valid value
        setText(prevText);
        onValueChange?.(Number(prevText));
      }
    },
    [prevText, onValueChange]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      applyValue(e.target.value);
    },
    [applyValue]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
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
    <input
      type="text"
      autoCorrect="off"
      autoComplete="off"
      autoCapitalize="off"
      data-slot="number-input"
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeydown}
      className={cn(
        "h-7 px-2 box-content w-full min-w-0 rounded-none",
        "text-sm text-dark-100 font-medium leading-4 lining-nums tabular-nums",
        "outline-none border border-dark-100 hover:border-lavender focus-within:border-lavender selection:bg-lavender/60",
        className
      )}
      {...props}
    />
  );
}
export { NumInput };

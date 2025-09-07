import { cn } from "@/lib/utils";

type NumberInputProps = Omit<React.ComponentProps<"input">, "type">;

function NumInput({ className, ...props }: NumberInputProps) {
  return (
    <input
      type="text"
      autoCorrect="off"
      autoComplete="off"
      autoCapitalize="off"
      data-slot="number-input"
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

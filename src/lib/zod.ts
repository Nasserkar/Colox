import { z } from "zod/v4";

export const NumberInputSchema = z
  .string()
  .regex(/^-?(?:\d+|\d*\.\d+)$/, { message: "invalid" })
  .transform((val) => parseFloat(val))
  .refine((num) => !Number.isNaN(num), { message: "invalid" });

//    if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) {
//     setText(text);
//     setPtext(text);
//   } else {
//     setText(ptext);
//   }

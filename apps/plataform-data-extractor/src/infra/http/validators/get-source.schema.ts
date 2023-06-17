import { z } from "zod";

export const GetSourceSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  query: z
    .object({
      recipe: z
        .string()
        .refine(
          (v) => v === "true" || v === "false",
          "This field needs to be a boolean."
        )
        .transform((v) => v === "true")
        .optional(),
      statements: z
        .string()
        .refine(
          (v) => v === "true" || v === "false",
          "This field needs to be a boolean."
        )
        .transform((v) => v === "true")
        .optional(),
      exportFile: z
        .string()
        .refine(
          (v) => v === "true" || v === "false",
          "This field needs to be a boolean."
        )
        .transform((v) => v === "true")
        .optional(),
    })
    .optional(),
});

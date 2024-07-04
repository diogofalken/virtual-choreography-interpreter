import { z } from "zod";

export const GetChoreographiesSchema = z.object({
  query: z.object({ sourceId: z.string() }),
});

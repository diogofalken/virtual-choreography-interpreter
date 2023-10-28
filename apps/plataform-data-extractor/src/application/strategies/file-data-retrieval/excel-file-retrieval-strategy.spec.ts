import path from "path";
import { describe, expect, it } from "vitest";

import { ExcelFileRetrievalStrategy } from "./excel-file-retrieval-strategy";

describe("ExcelFileRetrievalStrategy", () => {
  it("retrieve and transform the data", async () => {
    const strategy = new ExcelFileRetrievalStrategy();

    const filePath = path.resolve(
      __dirname,
      "../../../infra/data/logs_2019_2020_min.xlsx"
    );

    const result = await strategy.retrieveData(filePath);

    const objArray = strategy.toObjectArray(result.columns, result.rows);

    expect(result.columns).toHaveLength(9);
    expect(result.rows).toHaveLength(432);
    expect(objArray).toHaveLength(432);
  });
});

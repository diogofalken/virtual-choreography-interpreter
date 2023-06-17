import path from "path";
import { describe, expect, it } from "vitest";

import { ExcelFileRetrievalStrategy } from "./excel-file-retrieval-strategy";

describe("ExcelFileRetrievalStrategy", () => {
  it("test", async () => {
    const strategy = new ExcelFileRetrievalStrategy();

    const filePath = path.resolve(
      __dirname,
      "../../../infra/data/logs_2019_2020_min.xlsx"
    );

    await strategy.retrieveData(filePath);

    // const objArray = strategy.toObjectArray(result.columns, result.rows);

    expect(true).equals(true);
  });
});

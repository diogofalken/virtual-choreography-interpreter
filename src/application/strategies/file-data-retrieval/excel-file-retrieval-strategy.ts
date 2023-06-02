import { parse } from "node-xlsx";

import { FileDataRetrievalStrategy } from "./file-data-retrieval-strategy.interface";

export class ExcelFileRetrievalStrategy implements FileDataRetrievalStrategy {
  public async retrieveData(
    path: string
  ): Promise<{ columns: string[]; rows: string[][] }> {
    try {
      const [excelSheet] = parse(path, {
        raw: true,
      });

      const [columns, ...rows] = excelSheet.data;

      return {
        columns,
        rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public toObjectArray(
    columns: string[],
    rows: string[][]
  ): Record<string, string>[] {
    const objArray: Record<string, string>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const obj: Record<string, string> = {};

      for (let j = 0; j < columns.length; j++) {
        obj[columns[j]] = rows[i][j];
      }

      objArray.push(obj);
    }

    return objArray;
  }
}

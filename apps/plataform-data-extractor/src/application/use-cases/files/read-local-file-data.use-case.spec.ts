import { describe, expect, it } from "vitest";

import { SourceInMemoryRepository } from "../../../infra/db/in-memory/source-in-memory.repository";
import { ExcelFileRetrievalStrategy } from "../../strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { ReadLocalFileDataUseCase } from "./read-local-file-data.use-case";

describe("ReadLocalFileDataUseCase", () => {
  const sut = new ReadLocalFileDataUseCase(
    new SourceInMemoryRepository(),
    new ExcelFileRetrievalStrategy()
  );

  it("should read local file data", async () => {
    const result = await sut.execute({ fileName: "logs_2019_2020_min.xlsx" });

    expect(result.logs[0]).toMatchObject({
      timestamp: "8/03/22 às 10:51",
      username: "T4",
      affectedUser: "O1",
      context:
        "Unidade curricular: Laboratório de Desenvolvimento de Software 2019",
      component: "Registos de atividade",
      eventName: "Relatório de registos de atividade visualizado",
      description:
        "The user with id '******' viewed the log report for the course with id '******'.",
      origin: "web",
      ip: "192.168.16.142",
    });
  });

  it("should throw error if file columns are invalid", async () => {
    await expect(
      sut.execute({ fileName: "logs_invalid_columns.xlsx" })
    ).rejects.toThrowError("Invalid file columns");
  });
});

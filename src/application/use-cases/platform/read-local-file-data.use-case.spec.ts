import { describe, expect, it } from "vitest";

import { ExcelFileRetrievalStrategy } from "../../strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { ReadLocalFileDataUseCase } from "./read-local-file-data.use-case";

describe("ReadLocalFileDataUseCase", () => {
  it("should read local file data", async () => {
    const sut = new ReadLocalFileDataUseCase(new ExcelFileRetrievalStrategy());

    const result = await sut.execute({ fileName: "logs_2019_2020_min.xlsx" });

    console.log(result[0]);

    expect(result[0]).toMatchObject({
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
});

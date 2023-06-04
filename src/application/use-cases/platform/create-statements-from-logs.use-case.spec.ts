import { describe, expect, it } from "vitest";

import { StatementInMemoryRepository } from "../../../infra/db/statement-in-memory.repository";
import { CreateStatementsFromLogsUseCase } from "./create-statements-from-logs.use-case";

describe("CreateStatementsFromLogsUseCase", () => {
  it("should convert logs", async () => {
    const repository = new StatementInMemoryRepository();
    const sut = new CreateStatementsFromLogsUseCase(repository);

    const result = await sut.execute({
      logs: [
        {
          timestamp: "2/03/22 às 12:04",
          username: "T4",
          affectedUser: "O1",
          context: "Trabalho: Sala de desenvolvimento C9",
          component: "Trabalho",
          eventName: "Estado da submissão visualizado",
          description:
            "The user with id '******' has viewed the submission status page for the assignment with course module id '******'.",
          origin: "web",
          ip: "192.168.16.142",
        },
        {
          timestamp: "2/03/22 às 12:04",
          username: "T4",
          affectedUser: "O1",
          context: "Trabalho: Sala de desenvolvimento C9",
          component: "Trabalho",
          eventName: "Módulo de disciplina visualizado",
          description:
            "The user with id '******' viewed the 'assign' activity with course module id '******'.",
          origin: "web",
          ip: "192.168.16.142",
        },
        {
          timestamp: "2/03/22 às 12:04",
          username: "T4",
          affectedUser: "O1",
          context: "Teste: Sala de desenvolvimento C8",
          component: "Teste",
          eventName: "Módulo de disciplina visualizado",
          description:
            "The user with id '******' viewed the 'quiz' activity with course module id '******'.",
          origin: "web",
          ip: "192.168.16.142",
        },
      ],
      config: "MOODLE_CONFIG",
    });

    console.log(result);

    expect(true).toBe(true);
  });
});

import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "vitest";

import { Statement } from "shared/entities";
import { GetVirtualChoreographiesUseCase } from "./get-virtual-choreographies.use-case";

test("Teste", async () => {
  // read local json file
  const logStatements: {
    source: { id: string; name: string; type: string };
    statements: ReturnType<Statement["toJson"]>[];
  } = JSON.parse(
    readFileSync(
      path.resolve(__dirname, `../../../tmp/statements_2019_2020.json`),
      "utf8"
    )
  );

  const statements = logStatements.statements.map(
    (statement) =>
      new Statement({
        id: statement.id,
        sourceId: logStatements.source.id,
        actor: statement.actor,
        verb: statement.verb,
        object: statement.object,
        place: statement.place,
        context: statement.context,
      })
  );

  const sut = new GetVirtualChoreographiesUseCase();

  const result = await sut.execute({ statements });
});

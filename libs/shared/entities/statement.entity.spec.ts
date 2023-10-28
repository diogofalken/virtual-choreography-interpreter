import { describe, expect, it } from "vitest";
import { Statement } from "./statement.entity";

describe("StatementEntity", () => {
  const statementProps = {
    id: "1",
    sourceId: "1",
    actor: { id: "1", name: "Test" },
    verb: { id: "1", display: "Test" },
    object: { id: "1", definition: { name: "test" } },
    place: { id: "1", name: "Test" },
    context: {
      id: "1",
      extensions: {
        timestamp: "8/03/22 às 10:51",
        description: "test",
        event: "test",
        component: "test",
      },
    },
  };

  it("should create a new StatementEntity", () => {
    const statement = new Statement(statementProps);

    expect(statement.toJson()).toMatchObject({
      id: statementProps.id,
      actor: statementProps.actor,
      verb: statementProps.verb,
      object: statementProps.object,
      place: statementProps.place,
      context: statement.context,
    });
  });

  it("should translate a statement into natural language", () => {
    const statement = new Statement(statementProps);
    expect(statement.toNaturalLanguage()).toBe("Test Test test no Test");
  });

  it("should translate a statement into natural language with timestamp", () => {
    const statement = new Statement(statementProps);
    expect(statement.toNaturalLanguage(true)).toBe(
      "03/08/2022, 10:51:00 - Test Test test no Test"
    );
  });
});

import { describe, expect, it } from "vitest";
import { Choreography, ChoreographyProps } from "./choreography.entity";
import { Statement } from "./statement.entity";

describe("ChoreographyEntity", () => {
  const statement = new Statement({
    sourceId: "1",
    actor: { id: "1", name: "Test" },
    verb: { id: "1", display: "Test" },
    object: { id: "1", definition: { name: "test" } },
    place: { id: "1", name: "Test" },
  });

  it("should create a new ChoreographyEntity", () => {
    const data: ChoreographyProps = { id: "1", name: "Test", statements: [] };

    const choreography = new Choreography(data);

    expect(choreography.id).toBe(data.id);
    expect(choreography.name).toBe(data.name);
    expect(choreography.statements).toBe(data.statements);
  });

  it("should transform the Choreography into JSON", () => {
    const data: ChoreographyProps = { name: "Test", statements: [statement] };

    const choreography = new Choreography(data);

    expect(choreography.toJson()).toMatchObject(data);
  });

  it("should update all the statements from a choreography", () => {
    const data: ChoreographyProps = { name: "Test", statements: [] };
    const choreography = new Choreography(data);

    choreography.statements = [statement];

    expect(choreography.statements).toMatchObject([statement]);
  });

  it("should add one statement to the choreography", () => {
    const data: ChoreographyProps = { name: "Test", statements: [] };
    const choreography = new Choreography(data);

    choreography.addStatement(statement);

    expect(choreography.statements).toMatchObject([statement]);
  });
});

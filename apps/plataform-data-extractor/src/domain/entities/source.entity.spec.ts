import { describe, expect, it } from "vitest";
import { Source, SourceProps } from "./source.entity";

describe("SourceEntity", () => {
  it("should create a new SourceEntity", () => {
    const data: SourceProps = { name: "Test", type: "file" };

    const source = new Source(data);

    expect(source.name).toBe(data.name);
    expect(source.type).toBe(data.type);
  });

  it("should transform the Source into JSON", () => {
    const data: SourceProps = { id: "1", name: "Test", type: "file" };

    const source = new Source(data);

    expect(source.toJson()).toMatchObject(data);
  });
});

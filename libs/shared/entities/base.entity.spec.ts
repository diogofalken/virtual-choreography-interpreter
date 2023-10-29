import { describe, expect, it } from "vitest";
import { BaseEntity, BaseEntityProps } from "./base.entity";

describe("BaseEntity", () => {
  it("should create a new BaseEntity", () => {
    const data: BaseEntityProps = {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const base = new BaseEntity(data);

    expect(base.id).toBe(data.id);
    expect(base.createdAt).toBe(data.createdAt);
    expect(base.updatedAt).toBe(data.updatedAt);
  });
});

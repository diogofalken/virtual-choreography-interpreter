import { randomUUID } from "crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { Source, SourceProps } from "../../../domain/entities/source.entity";
import { SourceInMemoryRepository } from "./source-in-memory.repository";

describe("SourceInMemoryRepository", () => {
  let repository: SourceInMemoryRepository;
  const knownSource = new Source({ name: "string", type: "file" });

  beforeAll(async () => {
    repository = new SourceInMemoryRepository();
    await repository.create(knownSource);
  });

  it("should create a new source", async () => {
    const props: SourceProps = { name: "string", type: "file" };
    const source = new Source(props);

    await repository.create(source);

    const result = await repository.findById(source.id);

    expect(result).toMatchObject(source);
  });

  it("should find a source by id", async () => {
    const result = await repository.findById(knownSource.id);
    expect(result).toMatchObject(knownSource);
  });

  it("should return null when a source isn't found by source id", async () => {
    const result = await repository.findById(randomUUID());
    expect(result).toBeNull();
  });
});

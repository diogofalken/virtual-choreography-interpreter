import { randomUUID } from "crypto";
import { Recipe } from "shared/entities";
import { RecipeProps } from "shared/entities/recipe.entity";
import { beforeAll, describe, expect, it } from "vitest";
import { RecipeInMemoryRepository } from "./recipe-in-memory.repository";

describe("RecipeInMemoryRepository", () => {
  let repository: RecipeInMemoryRepository;
  const knownRecipe = new Recipe({ name: "a", sourceId: "b", statements: [] });

  beforeAll(async () => {
    repository = new RecipeInMemoryRepository();
    await repository.create(knownRecipe);
  });

  it("should create a new recipe", async () => {
    const props: RecipeProps = {
      name: "string",
      sourceId: "string",
      statements: [],
    };
    const recipe = new Recipe(props);

    await repository.create(recipe);

    const result = await repository.findById(recipe.id);

    expect(result).toMatchObject(recipe);
  });

  it("should find a recipe by id", async () => {
    const result = await repository.findById(knownRecipe.id);
    expect(result).toMatchObject(knownRecipe);
  });

  it("should return null when a recipe isn't found by recipe id", async () => {
    const result = await repository.findById(randomUUID());
    expect(result).toBeNull();
  });

  it("should find all the recipes by source id", async () => {
    const result = await repository.findBySourceId(knownRecipe.sourceId);
    expect(result).toMatchObject(knownRecipe);
  });

  it("should return null when a recipe isn't found by source id", async () => {
    const result = await repository.findBySourceId(randomUUID());
    expect(result).toBeNull();
  });
});

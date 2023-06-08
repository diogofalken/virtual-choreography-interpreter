import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { Recipe } from "../../../domain/entities/recipe.entity";
import { RecipeInMemoryRepository } from "../../../infra/db/in-memory/recipe-in-memory.repository";
import { GetRecipeUseCase } from "./get-recipe.use-case";

describe("Get Recipe Use Case", () => {
  it("should return a recipe that exists", async () => {
    const recipeRepository = new RecipeInMemoryRepository();

    const expected = new Recipe({
      id: randomUUID(),
      name: "Recipe 1",
      statements: [],
    });

    vi.spyOn(recipeRepository, "findById").mockResolvedValue(expected);

    const sut = new GetRecipeUseCase(recipeRepository);

    const result = await sut.execute({ id: expected.id });

    expect(result).toEqual(expected);
  });

  it("should return null if a recipe doesnt exist", async () => {
    const recipeRepository = new RecipeInMemoryRepository();

    vi.spyOn(recipeRepository, "findById").mockResolvedValue(null);

    const sut = new GetRecipeUseCase(recipeRepository);

    const result = await sut.execute({ id: randomUUID() });

    expect(result).toEqual(null);
  });
});

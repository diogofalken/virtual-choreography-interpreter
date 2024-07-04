import { describe, expect, it } from "vitest";
import { Recipe, RecipeProps } from "./recipe.entity";

describe("RecipeEntity", () => {
  it("should create a new RecipeEntity", () => {
    const data: RecipeProps = {
      id: "1",
      name: "test",
      sourceId: "test",
      statements: [],
    };

    const recipe = new Recipe(data);

    expect(recipe.toJson()).toMatchObject({
      name: data.name,
      actors: [],
      verbs: [],
      objects: [],
      places: [],
      contexts: [],
    });
  });
});

import { Recipe } from "shared/entities";
import { RecipeRepository } from "shared/repositories";

export class RecipeInMemoryRepository implements RecipeRepository {
  readonly #recipes: Recipe[] = [];

  public async create(recipe: Recipe): Promise<void> {
    this.#recipes.push(recipe);
  }

  public async findById(id: string): Promise<Recipe | null> {
    return this.#recipes.find((recipe) => recipe.id === id) ?? null;
  }

  public async findBySourceId(sourceId: string): Promise<Recipe | null> {
    return this.#recipes.find((recipe) => recipe.sourceId === sourceId) ?? null;
  }
}

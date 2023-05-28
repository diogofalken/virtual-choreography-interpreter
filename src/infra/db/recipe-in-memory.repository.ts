import { Recipe } from "../../domain/entities/recipe.entity";
import { RecipeRepository } from "../../domain/repositories/recipe.repository";

export class RecipeInMemoryRepository implements RecipeRepository {
  readonly #recipes: Recipe[] = [];

  public async create(recipe: Recipe): Promise<void> {
    this.#recipes.push(recipe);
  }

  public async findById(id: string): Promise<Recipe | null> {
    return this.#recipes.find((recipe) => recipe.id === id) ?? null;
  }
}

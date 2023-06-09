import { Recipe } from "../entities/recipe.entity";

export interface RecipeRepository {
  create(recipe: Recipe): Promise<void>;
  findById(id: string): Promise<Recipe | null>;
  findBySourceId(sourceId: string): Promise<Recipe | null>;
}

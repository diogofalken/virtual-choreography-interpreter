import { Recipe } from "shared/entities";
import { RecipeRepository } from "shared/repositories";

export type GetRecipeUseCaseInput = { id: string };
export type GetRecipeUseCaseOutput = Recipe | null;

export class GetRecipeUseCase {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  public async execute(
    input: GetRecipeUseCaseInput
  ): Promise<GetRecipeUseCaseOutput> {
    return await this.recipeRepository.findById(input.id);
  }
}

import { Recipe } from "shared/entities";
import { RecipeRepository, StatementRepository } from "shared/repositories";

export type CreateRecipeUseCaseInput = {
  name: string;
  sourceId: string;
};
export type CreateRecipeUseCaseOutput = Recipe;

export class CreateRecipeUseCase {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly statementRepository: StatementRepository
  ) {}

  public async execute(
    input: CreateRecipeUseCaseInput
  ): Promise<CreateRecipeUseCaseOutput> {
    const statements = await this.statementRepository.findAll({
      sourceId: input.sourceId,
    });

    const recipe = new Recipe({
      name: input.name,
      sourceId: input.sourceId,
      statements,
    });

    await this.recipeRepository.create(recipe);

    return recipe;
  }
}

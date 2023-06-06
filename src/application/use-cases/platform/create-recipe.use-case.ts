import { Recipe } from "../../../domain/entities/recipe.entity";
import { RecipeRepository } from "../../../domain/repositories/recipe.repository";
import { StatementRepository } from "../../../domain/repositories/statement.repository";

export type CreateRecipeUseCaseInput = {
  name: string;
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
    const statements = await this.statementRepository.findAll();

    const recipe = new Recipe({
      name: input.name,
      statements,
    });

    await this.recipeRepository.create(recipe);

    return recipe;
  }
}

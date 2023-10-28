import { parse } from "path";
import { RecipeRepository, StatementRepository } from "shared/repositories";
import { JSONValue } from "shared/types";
import { SourceRepository } from "../../../domain/repositories/source.repository";
import { WriteLocalFileUsecase } from "../files/write-local-file.use-case";

type ExportUseCaseInput = {
  sourceId: string;
  type: ("RECIPE" | "STATEMENTS")[];
  exportFile?: boolean;
};

export class ExportSourceUseCase {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly recipeRepository: RecipeRepository,
    private readonly statementRepository: StatementRepository,
    private readonly writeLocalFileUseCase: WriteLocalFileUsecase
  ) {}

  async execute(input: ExportUseCaseInput) {
    const source = await this.sourceRepository.findById(input.sourceId);
    if (!source) {
      throw new Error("Source not found");
    }

    const data: Partial<Record<"source" | "recipe" | "statements", JSONValue>> =
      { source: source.toJson() };

    if (input.type.includes("RECIPE") || input.type.length === 0) {
      const recipe = await this.recipeRepository.findBySourceId(source.id);
      if (recipe) {
        data.recipe = recipe.toJson();
      }
    }
    if (input.type.includes("STATEMENTS") || input.type.length === 0) {
      const statements = await this.statementRepository.findAll({
        sourceId: source.id,
      });
      if (statements.length > 0) {
        data.statements = statements.map((statement) => statement.toJson());
      }
    }

    if (input.exportFile) {
      await this.writeLocalFileUseCase.execute({
        fileName: parse(source.name).name,
        data: data,
      });
    }

    return data;
  }
}

import { describe, expect, it } from "vitest";
import { RecipeInMemoryRepository } from "../../../infra/db/in-memory/recipe-in-memory.repository";
import { SourceInMemoryRepository } from "../../../infra/db/in-memory/source-in-memory.repository";
import { StatementInMemoryRepository } from "../../../infra/db/in-memory/statement-in-memory.repository";
import { ExcelFileRetrievalStrategy } from "../../strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { ReadLocalFileDataUseCase } from "../files/read-local-file-data.use-case";
import { WriteLocalFileUsecase } from "../files/write-local-file.use-case";
import { CreateRecipeUseCase } from "../recipes/create-recipe.use-case";
import { CreateStatementsFromLogsUseCase } from "../statements/create-statements-from-logs.use-case";
import { ExportSourceUseCase } from "./export-source.use-case";

describe("ExportSourceUseCase", () => {
  it("should export a source with statements and recipe", async () => {
    const sourceRepository = new SourceInMemoryRepository();
    const statementRepository = new StatementInMemoryRepository();
    const recipeRepository = new RecipeInMemoryRepository();

    // Read Local File Use Case
    const readLocalFileUseCase = new ReadLocalFileDataUseCase(
      sourceRepository,
      new ExcelFileRetrievalStrategy()
    );
    const readLocalFileData = await readLocalFileUseCase.execute({
      fileName: "logs_2019_2020_min.xlsx",
    });

    // Create Statements from Logs Use Case
    const createStatementsFromLogs = new CreateStatementsFromLogsUseCase(
      statementRepository
    );
    await createStatementsFromLogs.execute({
      config: "MOODLE_CONFIG",
      logs: readLocalFileData.logs,
      sourceId: readLocalFileData.sourceId,
    });

    // Create Recipe Use Case
    const createRecipeUseCase = new CreateRecipeUseCase(
      recipeRepository,
      statementRepository
    );
    await createRecipeUseCase.execute({
      name: "Batata",
      sourceId: readLocalFileData.sourceId,
    });

    const exportSourceUseCase = new ExportSourceUseCase(
      sourceRepository,
      recipeRepository,
      statementRepository,
      new WriteLocalFileUsecase()
    );

    const result = await exportSourceUseCase.execute({
      sourceId: readLocalFileData.sourceId,
      type: ["RECIPE", "STATEMENTS"],
    });

    expect(result.recipe).toBeDefined();
    expect(result.statements).toBeDefined();
  });
});

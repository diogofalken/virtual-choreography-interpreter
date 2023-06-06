import { describe, expect, it } from "vitest";
import { RecipeInMemoryRepository } from "../../../infra/db/recipe-in-memory.repository";
import { SourceInMemoryRepository } from "../../../infra/db/source-in-memory.repository";
import { StatementInMemoryRepository } from "../../../infra/db/statement-in-memory.repository";
import { ExcelFileRetrievalStrategy } from "../../strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { CreateRecipeUseCase } from "./create-recipe.use-case";
import { CreateStatementsFromLogsUseCase } from "./create-statements-from-logs.use-case";
import { ReadLocalFileDataUseCase } from "./read-local-file-data.use-case";

describe("CreateRecipeUseCase", () => {
  it("should create a recipe", async () => {
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
    const recipe = await createRecipeUseCase.execute({
      name: "Batata",
      sourceId: readLocalFileData.sourceId,
    });

    // console.log(recipe.toJson());

    expect(recipe.actors).toHaveLength(3);
    expect(recipe.verbs).toHaveLength(1);
    expect(recipe.objects).toHaveLength(37);
    expect(recipe.places).toHaveLength(6);
    expect(recipe.contexts).toHaveLength(66);
  });
});

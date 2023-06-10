import { ExportSourceUseCase } from "../../../application/use-cases/sources/export-source.use-case";
import { JSONValue } from "../../../domain/types/general.types";

export class GetSourceController {
  constructor(private readonly exportSourceUseCase: ExportSourceUseCase) {}

  async handle(
    id: string,
    query?: { recipe?: boolean; statements?: boolean; exportFile?: boolean }
  ): Promise<Partial<Record<"recipe" | "statements" | "source", JSONValue>>> {
    const type: ("RECIPE" | "STATEMENTS")[] = [];
    if (query?.recipe) {
      type.push("RECIPE");
    }
    if (query?.statements) {
      type.push("STATEMENTS");
    }

    const data = await this.exportSourceUseCase.execute({
      sourceId: id,
      type,
      exportFile: query?.exportFile,
    });

    return data;
  }
}

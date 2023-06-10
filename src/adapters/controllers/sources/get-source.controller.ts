import { Request, Response } from "express";
import { ExportSourceUseCase } from "../../../application/use-cases/sources/export-source.use-case";

export class GetSourceController {
  constructor(private readonly exportSourceUseCase: ExportSourceUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { recipe, statements, exportFile } = request.query;

    const type: ("RECIPE" | "STATEMENTS")[] = [];
    if (recipe) {
      type.push("RECIPE");
    }
    if (statements) {
      type.push("STATEMENTS");
    }

    const data = await this.exportSourceUseCase.execute({
      sourceId: id,
      type,
      exportFile: exportFile === "true",
    });

    return response.status(200).json({
      data,
    });
  }
}

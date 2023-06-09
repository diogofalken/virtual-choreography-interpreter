import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { ReadLocalFileDataUseCase } from "../../../application/use-cases/files/read-local-file-data.use-case";
import { CreateStatementsFromLogsUseCase } from "../../../application/use-cases/statements/create-statements-from-logs.use-case";

export class CreateSourceController {
  constructor(
    private readonly readLocalFileDataUseCase: ReadLocalFileDataUseCase,
    private readonly createStatementsFromLogsUseCase: CreateStatementsFromLogsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    if (!request.file) {
      throw new Error("File not provided");
    }

    const fileData = await this.readLocalFileDataUseCase.execute({
      fileName: request.file.originalname,
      path: request.file.path,
    });

    await this.createStatementsFromLogsUseCase.execute({
      config: "MOODLE_CONFIG",
      sourceId: fileData.sourceId,
      logs: fileData.logs,
    });

    // Delete tmp file
    await unlink(request.file.path);

    return response.status(201).json({
      id: fileData.sourceId,
    });
  }
}

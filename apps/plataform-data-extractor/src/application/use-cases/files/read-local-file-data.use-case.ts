import path from "path";

import { MoodleFileColumns } from "../../../config/moodle.config";
import { Source } from "../../../domain/entities/source.entity";
import { SourceRepository } from "../../../domain/repositories/source.repository";
import { FileDataRetrievalStrategy } from "../../strategies/file-data-retrieval/file-data-retrieval-strategy.interface";

type ReadLocalFileDataUseCaseInput = {
  fileName: string;
  path?: string;
};

type ReadLocalFileDataUseCaseOutput = {
  sourceId: string;
  logs: Record<string, string>[];
};

export class ReadLocalFileDataUseCase {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly fileDataRetrievalStrategy: FileDataRetrievalStrategy
  ) {}

  async execute(
    input: ReadLocalFileDataUseCaseInput
  ): Promise<ReadLocalFileDataUseCaseOutput> {
    const filePath =
      input.path ??
      path.resolve(__dirname, `../../../infra/data/${input.fileName}`);

    const result = await this.fileDataRetrievalStrategy.retrieveData(filePath);

    // TODO: In future pass the config
    if (!this.isValidColumns(result.columns)) {
      throw new Error("Invalid file columns");
    }

    const logs = this.fileDataRetrievalStrategy.toObjectArray(
      result.columns,
      result.rows
    );

    const source = new Source({ name: input.fileName, type: "file" });
    await this.sourceRepository.create(source);

    return {
      sourceId: source.id,
      logs,
    };
  }

  private isValidColumns(columns: string[], config = "MOODLE_CONFIG"): boolean {
    let validColumns: Readonly<string[]> = [];
    switch (config) {
      case "MOODLE_CONFIG":
        validColumns = MoodleFileColumns;
        break;
      default:
        break;
    }

    if (JSON.stringify(columns) === JSON.stringify(validColumns)) {
      return true;
    }
    return false;
  }
}

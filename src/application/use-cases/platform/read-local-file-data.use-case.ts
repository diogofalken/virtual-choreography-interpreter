import path from "path";

import { Source } from "../../../domain/entities/source.entity";
import { SourceRepository } from "../../../domain/repositories/source.repository";
import { FileDataRetrievalStrategy } from "../../strategies/file-data-retrieval/file-data-retrieval-strategy.interface";

type ReadLocalFileDataUseCaseInput = {
  fileName: string;
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
    const filePath = path.resolve(
      __dirname,
      `../../../infra/data/${input.fileName}`
    );

    const result = await this.fileDataRetrievalStrategy.retrieveData(filePath);

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
}

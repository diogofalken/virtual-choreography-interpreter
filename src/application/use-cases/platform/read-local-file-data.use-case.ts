import path from "path";

import { FileDataRetrievalStrategy } from "../../strategies/file-data-retrieval/file-data-retrieval-strategy.interface";

type ReadLocalFileDataUseCaseInput = {
  fileName: string;
};

type ReadLocalFileDataUseCaseOutput = Record<string, string>[];

export class ReadLocalFileDataUseCase {
  constructor(
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

    return this.fileDataRetrievalStrategy.toObjectArray(
      result.columns,
      result.rows
    );
  }
}

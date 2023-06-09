import { writeFileSync } from "fs";
import path from "path";
import { JSONValue } from "../../../domain/types/general.types";

type WriteLocalFileUsecaseInput = {
  fileName: string;
  data: Record<string, JSONValue>;
};

export class WriteLocalFileUsecase {
  async execute(input: WriteLocalFileUsecaseInput): Promise<void> {
    // TODO: validate if fileName is correct
    const filePath = path.resolve(
      __dirname,
      `../../../../tmp/${input.fileName}_${new Date().toISOString()}.json`
    );

    try {
      writeFileSync(filePath, JSON.stringify(input.data));
    } catch (err: unknown) {
      throw new Error(`Error writing file: ${err}`);
    }
  }
}

import { Statement } from "shared/entities";
import type { StatementRepository } from "shared/repositories";
import { ConfigMatcherHelper } from "../../helpers/config-matcher.helper";

type CreateStatementsFromLogsUseCaseInput = {
  sourceId: string;
  logs: Record<string, string>[];
  config: "MOODLE_CONFIG";
};

type CreateStatementsFromLogsUseCaseOutput = Statement[];

export class CreateStatementsFromLogsUseCase {
  constructor(private readonly statementRepository: StatementRepository) {}

  public async execute(
    input: CreateStatementsFromLogsUseCaseInput
  ): Promise<CreateStatementsFromLogsUseCaseOutput> {
    const { logs, config } = input;

    const configMatcherHelper = new ConfigMatcherHelper();

    for (const log of logs) {
      const statement = configMatcherHelper.convertLog(
        config,
        log,
        input.sourceId
      );

      if (statement) {
        await this.statementRepository.create(statement);
      }
    }

    return await this.statementRepository.findAll();
  }
}

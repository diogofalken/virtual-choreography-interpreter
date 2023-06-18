import { Statement } from "shared/entities";
import { StatementRepository } from "shared/repositories";

type GetStatementsUseCaseInput = {
  filters?: {
    sourceId?: string;
  };
};

type GetStatementsUseCaseOutput = Statement[];

export class GetStatementsUseCase {
  constructor(private readonly statementRepository: StatementRepository) {}

  public async execute(
    input: GetStatementsUseCaseInput
  ): Promise<GetStatementsUseCaseOutput> {
    return await this.statementRepository.findAll(input.filters);
  }
}

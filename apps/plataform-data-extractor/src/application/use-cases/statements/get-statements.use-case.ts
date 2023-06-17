import { Statement } from "../../../domain/entities/statement.entity";
import { StatementRepository } from "../../../domain/repositories/statement.repository";

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

import { Statement } from "../../domain/entities/statement.entity";
import { StatementRepository } from "../../domain/repositories/statement.repository";

export class StatementInMemoryRepository implements StatementRepository {
  readonly #statements: Statement[] = [];

  public async create(statement: Statement): Promise<void> {
    this.#statements.push(statement);
  }

  public async findById(id: string): Promise<Statement | null> {
    return this.#statements.find((statement) => statement.id === id) ?? null;
  }

  public async findAll(): Promise<Statement[]> {
    return this.#statements;
  }
}

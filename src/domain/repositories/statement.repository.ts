import { Statement } from "../entities/statement.entity";

export interface StatementRepository {
  create(statement: Statement): Promise<void>;
  findById(id: string): Promise<Statement | null>;
  findAll(params?: { sourceId?: string }): Promise<Statement[]>;
}

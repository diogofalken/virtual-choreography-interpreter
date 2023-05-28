import { BaseEntity } from "./base.entity";
import { Statement } from "./statement.entity";

export type ChoreographyProps = {
  id?: string;
  name: string;
  statements: Statement[];
};

export class Choreography extends BaseEntity {
  readonly #name: string;
  #statements: Statement[];

  constructor(props: ChoreographyProps) {
    super({ id: props.id });
    this.#name = props.name;
    this.#statements = props.statements;
  }

  get name() {
    return this.#name;
  }
  get statements() {
    return this.#statements;
  }

  set statements(statements: Statement[]) {
    this.#statements = statements;
  }

  public addStatement(statement: Statement) {
    this.#statements.push(statement);
  }

  public toJson() {
    return {
      name: this.#name,
      statements: this.#statements.map((statement) => statement.toJson()),
    };
  }
}

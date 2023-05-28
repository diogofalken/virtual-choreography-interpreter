import { Statement } from "./statement.entity";

export type ChoreographyProps = {
  name: string;
  statements: Statement[];
};

export class Choreography {
  readonly #name: string;
  #statements: Statement[];

  constructor(props: ChoreographyProps) {
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

import { Statement } from "../../domain/entities/statement.entity";
import { StatementRepository } from "../../domain/repositories/statement.repository";

export class StatementInMemoryRepository implements StatementRepository {
  readonly #statements: Statement[] = [];

  public async create(statement: Statement): Promise<void> {
    const elementsThatAlreadyExist =
      this.getElementsThatAlreadyExists(statement);

    this.#statements.push(
      new Statement({
        sourceId: statement.sourceId,
        actor: elementsThatAlreadyExist.actor ?? statement.actor,
        place: elementsThatAlreadyExist.place ?? statement.place,
        object: elementsThatAlreadyExist.object ?? statement.object,
        verb: elementsThatAlreadyExist.verb ?? statement.verb,
        context: statement.context,
      })
    );
  }

  public async findById(id: string): Promise<Statement | null> {
    return this.#statements.find((statement) => statement.id === id) ?? null;
  }

  public async findBySourceId(sourceId: string): Promise<Statement | null> {
    return (
      this.#statements.find((statement) => statement.sourceId === sourceId) ??
      null
    );
  }

  public async findAll(params: { sourceId?: string }): Promise<Statement[]> {
    if (params?.sourceId) {
      return this.#statements.filter(
        (statement) => statement.sourceId === params.sourceId
      );
    }

    return this.#statements;
  }

  private getElementsThatAlreadyExists(statement: Statement): {
    actor?: Statement["actor"];
    place?: Statement["place"];
    object?: Statement["object"];
    verb?: Statement["verb"];
  } {
    let foundActor: Statement["actor"] | undefined;
    let foundPlace: Statement["place"] | undefined;
    let foundObject: Statement["object"] | undefined;
    let foundVerb: Statement["verb"] | undefined;

    for (const dbStatement of this.#statements) {
      if (!foundActor && dbStatement.actor.name === statement.actor.name) {
        foundActor = dbStatement.actor;
      }
      if (!foundPlace && dbStatement.place.name === statement.place.name) {
        foundPlace = dbStatement.place;
      }
      if (
        !foundObject &&
        dbStatement.object.definition.name === statement.object.definition.name
      ) {
        foundObject = dbStatement.object;
      }
      if (!foundVerb && dbStatement.verb.display === statement.verb.display) {
        foundVerb = dbStatement.verb;
      }

      if (foundActor && foundPlace && foundObject && foundVerb) {
        break;
      }
    }

    return {
      actor: foundActor,
      place: foundPlace,
      object: foundObject,
      verb: foundVerb,
    };
  }
}

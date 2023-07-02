import { Statement } from "shared/entities";
import { JSONValue } from "shared/types";
import { GetVirtualChoreographiesUseCase } from "../../application/use-cases/get-virtual-choreographies.use-case";

export class GetChoreographiesController {
  constructor(
    private readonly getVirtualChoreographiesUseCase: GetVirtualChoreographiesUseCase
  ) {}

  async handle(
    statements: ReturnType<Statement["toJson"]>[],
    sourceId: string
  ): Promise<JSONValue[]> {
    const data = await this.getVirtualChoreographiesUseCase.execute({
      statements: statements.map(
        (s) =>
          new Statement({
            id: s.id,
            sourceId,
            actor: s.actor,
            verb: s.verb,
            object: s.object,
            place: s.place,
            context: s.context,
          })
      ),
    });

    return data.map((c) => c.toJson());
  }
}

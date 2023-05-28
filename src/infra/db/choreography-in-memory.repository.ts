import { Choreography } from "../../domain/entities/choreography.entity";
import { ChoreographyRepository } from "../../domain/repositories/choreography.repository";

export class ChoreographyInMemoryRepository implements ChoreographyRepository {
  readonly #choreographies: Choreography[] = [];

  public async create(choreography: Choreography): Promise<void> {
    this.#choreographies.push(choreography);
  }

  public async updateById(
    id: string,
    choreography: Choreography
  ): Promise<void> {
    const index = this.#choreographies.findIndex(
      (choreography) => choreography.id === id
    );

    if (index === -1) {
      throw new Error("Choreography not found");
    }

    this.#choreographies[index] = choreography;
  }

  public async findById(id: string): Promise<Choreography | null> {
    return (
      this.#choreographies.find((choreography) => choreography.id === id) ??
      null
    );
  }

  public async findAll(): Promise<Choreography[]> {
    return this.#choreographies;
  }
}

import { Source } from "../../domain/entities/source.entity";
import { SourceRepository } from "../../domain/repositories/source.repository";

export class SourceInMemoryRepository implements SourceRepository {
  readonly #sources: Source[] = [];

  public async create(source: Source): Promise<void> {
    this.#sources.push(source);
  }

  public async findById(id: string): Promise<Source | null> {
    return this.#sources.find((source) => source.id === id) ?? null;
  }
}

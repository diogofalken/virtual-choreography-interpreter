import { Source } from "../entities/source.entity";

export interface SourceRepository {
  create(source: Source): Promise<void>;
  findById(id: string): Promise<Source | null>;
}

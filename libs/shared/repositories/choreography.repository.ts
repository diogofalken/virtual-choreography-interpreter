import { Choreography } from "../entities/choreography.entity";

export interface ChoreographyRepository {
  create(choreography: Choreography): Promise<void>;
  updateById(id: string, choreography: Choreography): Promise<void>;
  findById(id: string): Promise<Choreography | null>;
  findAll(): Promise<Choreography[]>;
}

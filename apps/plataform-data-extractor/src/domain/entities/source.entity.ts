import { BaseEntity } from "shared/entities";
import { SourceType } from "../types/source.types";

export type SourceProps = {
  id?: string;
  name: string;
  type: SourceType;
};

export class Source extends BaseEntity {
  #name: string;
  #type: SourceType;

  constructor(props: SourceProps) {
    super({ id: props.id });
    this.#name = props.name;
    this.#type = props.type;
  }

  get name() {
    return this.#name;
  }
  get type() {
    return this.#type;
  }

  public toJson() {
    return {
      id: this.id,
      name: this.#name,
      type: this.#type,
    };
  }
}

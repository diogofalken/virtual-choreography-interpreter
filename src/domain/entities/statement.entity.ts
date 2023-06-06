import {
  ActorType,
  ContextType,
  ObjectType,
  PlaceType,
  VerbType,
} from "../types/xapi-elements.types";
import { BaseEntity } from "./base.entity";

export type StatementProps = {
  id?: string;
  sourceId: string;
  actor: ActorType;
  verb: VerbType;
  object: ObjectType;
  place: PlaceType;
  context: ContextType;
};

/**
 * Criar mecanismo para retornar que X id corresponde a X actor ou statement
 */
export class Statement extends BaseEntity {
  readonly #sourceId: string;
  #actor: ActorType;
  #verb: VerbType;
  #object: ObjectType;
  #place: PlaceType;
  #context: ContextType;

  constructor(props: StatementProps) {
    super({ id: props.id });
    this.#sourceId = props.sourceId;
    this.#actor = props.actor;
    this.#verb = props.verb;
    this.#object = props.object;
    this.#place = props.place;
    this.#context = props.context;
  }

  get sourceId() {
    return this.#sourceId;
  }
  get actor() {
    return this.#actor;
  }
  get verb() {
    return this.#verb;
  }
  get object() {
    return this.#object;
  }
  get place() {
    return this.#place;
  }
  get context() {
    return this.#context;
  }

  public toJson() {
    return {
      id: this.id,
      actor: this.#actor,
      verb: this.#verb,
      object: this.#object,
      place: this.#place,
      context: this.#context,
    };
  }
}

import { DateTime } from "luxon";

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
  context?: ContextType;
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
  #context?: ContextType;

  constructor(props: StatementProps) {
    super({ id: props.id });
    this.#sourceId = props.sourceId;
    this.#actor = props.actor;
    this.#verb = props.verb;
    this.#object = props.object;
    this.#place = props.place;
    if (props.context) {
      this.#context = {
        id: props.context.id,
        extensions: {
          timestamp:
            this.#parseTimestamp(props.context.extensions.timestamp) ?? "",
          description: props.context.extensions.description,
          event: props.context.extensions.event,
          component: props.context.extensions.component,
        },
      };
    }
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

  #parseTimestamp(timestamp: string): string | null {
    const isoDate = DateTime.fromISO(timestamp);
    if (isoDate.isValid) {
      return isoDate.toISO();
    }

    const otherDateFormats = ["M/dd/yy 'às' HH:mm", "dd/MM/yy 'às' HH:mm"];

    for (const dateFormat of otherDateFormats) {
      const parsedDate = DateTime.fromFormat(timestamp, dateFormat);

      if (parsedDate.isValid) {
        return parsedDate.toISO();
      }
    }

    throw new Error(`Invalid date format: ${timestamp}`);
  }
}

import {
  ActorType,
  ContextType,
  ObjectType,
  PlaceType,
  VerbType,
} from "../types/xapi-elements.types";
import { BaseEntity } from "./base.entity";
import { Statement } from "./statement.entity";

export type RecipeProps = {
  id?: string;
  name: string;
  sourceId: string;
  statements: Statement[];
};

export class Recipe extends BaseEntity {
  readonly #name: string;
  readonly #sourceId: string;
  #actors: ActorType[];
  #verbs: VerbType[];
  #objects: ObjectType[];
  #places: PlaceType[];
  #contexts: ContextType[];

  constructor(props: RecipeProps) {
    super({ id: props.id });
    this.#name = props.name;
    this.#sourceId = props.sourceId;
    this.#actors = [];
    this.#verbs = [];
    this.#objects = [];
    this.#places = [];
    this.#contexts = [];

    if (props.statements.length > 0) {
      this.addElementsFromStatement(props.statements);
    }
  }

  public addElementsFromStatement(statements: Statement[]) {
    for (const statement of statements) {
      this.addActor(statement.actor);
      this.addVerb(statement.verb);
      this.addPlace(statement.place);
      this.addObject(statement.object);
      this.addContext(statement.context);
    }
  }

  public addActor(actor: ActorType) {
    if (!this.elementExistsOnArray(this.#actors, actor.id)) {
      this.#actors.push(actor);
    }
  }
  public addVerb(verb: VerbType) {
    if (!this.elementExistsOnArray(this.#verbs, verb.id)) {
      this.#verbs.push(verb);
    }
  }
  public addObject(object: ObjectType) {
    if (!this.elementExistsOnArray(this.#objects, object.id)) {
      this.#objects.push(object);
    }
  }
  public addPlace(place: PlaceType) {
    if (!this.elementExistsOnArray(this.#places, place.id)) {
      this.#places.push(place);
    }
  }
  public addContext(context?: ContextType) {
    if (context && !this.elementExistsOnArray(this.#contexts, context.id)) {
      this.#contexts.push(context);
    }
  }

  get sourceId() {
    return this.#sourceId;
  }
  get actors() {
    return this.#actors;
  }
  get verbs() {
    return this.#verbs;
  }
  get objects() {
    return this.#objects;
  }
  get places() {
    return this.#places;
  }
  get contexts() {
    return this.#contexts;
  }

  public toJson() {
    return {
      name: this.#name,
      actors: this.#actors,
      verbs: this.#verbs,
      objects: this.#objects,
      places: this.#places,
      contexts: this.#contexts,
    };
  }

  private elementExistsOnArray<T extends { id: string }>(
    array: T[],
    id: string
  ) {
    return array.some((element) => element.id === id);
  }
}

import { randomUUID } from "node:crypto";

type BaseEntityProps = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class BaseEntity {
  readonly #id: string;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  get id() {
    return this.#id;
  }
  get createdAt() {
    return this.#createdAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  constructor(props?: BaseEntityProps) {
    const now = new Date();
    this.#id = props?.id ?? randomUUID();
    this.#createdAt = props?.createdAt ?? now;
    this.#updatedAt = props?.updatedAt ?? now;
  }
}

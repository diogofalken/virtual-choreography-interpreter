import { randomUUID } from "crypto";
import { Statement } from "shared/entities";

export type EadStatement = {
  actor?: string;
  verb?: string;
  object?: string;
  place?: string;
};

export enum EadForumStatementId {
  CREATE_TOPIC_AND_PUBLISH_CONTENT = "CREATE_TOPIC_AND_PUBLISH_CONTENT",
  UPDATE_TOPIC_AND_PUBLISH_CONTENT = "UPDATE_TOPIC_AND_PUBLISH_CONTENT",
}

const createTopicAndPublishContent = new Statement({
  id: EadForumStatementId.CREATE_TOPIC_AND_PUBLISH_CONTENT,
  sourceId: "ead-forum",
  actor: {
    id: "{{ randomUUID }}",
    name: "{{ actor }}",
  },
  verb: {
    id: "http://diogomcosta.com/xapi/verb/create-and-publish",
    display: "criou e publicou",
  },
  object: {
    id: randomUUID(),
    definition: {
      name: "conteúdo",
    },
  },
  place: {
    id: "{{ randomUUID }}",
    name: "{{ place }}",
  },
});

export const FORUM_STATEMENTS: Statement[] = [createTopicAndPublishContent];

export const GENERATE_FORUM_STATEMENTS: Partial<
  Record<EadForumStatementId, Statement>
> = {
  [EadForumStatementId.CREATE_TOPIC_AND_PUBLISH_CONTENT]: new Statement({
    id: "{{ randomUUID }}",
    sourceId: "ead-forum",
    actor: {
      id: "{{ randomUUID }}",
      name: "{{ actor }}",
    },
    verb: {
      id: "http://diogomcosta.com/xapi/verb/create-and-publish",
      display: "criou e publicou",
    },
    object: {
      id: randomUUID(),
      definition: {
        name: "conteúdo",
      },
    },
    place: {
      id: "{{ randomUUID }}",
      name: "{{ place }}",
    },
  }),
  [EadForumStatementId.UPDATE_TOPIC_AND_PUBLISH_CONTENT]: new Statement({
    id: "{{ randomUUID }}",
    sourceId: "ead-forum",
    actor: {
      id: "{{ randomUUID }}",
      name: "{{ actor }}",
    },
    verb: {
      id: "http://diogomcosta.com/xapi/verb/update-and-publish",
      display: "atualizou e publicou",
    },
    object: {
      id: randomUUID(),
      definition: {
        name: "conteúdo",
      },
    },
    place: {
      id: "{{ randomUUID }}",
      name: "{{ place }}",
    },
  }),
};

export const MOODLE_STATEMENT_MATCH: Record<
  EadForumStatementId,
  EadStatement[]
> = {
  [EadForumStatementId.CREATE_TOPIC_AND_PUBLISH_CONTENT]: [
    {
      verb: "http://adlnet.gov/expapi/verbs/viewed",
      object: "módulo de disciplina",
    },
    { verb: "http://adlnet.gov/expapi/verbs/viewed", object: "discussão" },
    { verb: "http://activitystrea.ms/schema/1.0/create", object: "tópico" },
    {
      verb: "http://diogomcosta.com/xapi/verb/published",
      object: "conteúdo",
    },
  ],
  [EadForumStatementId.UPDATE_TOPIC_AND_PUBLISH_CONTENT]: [
    {
      verb: "http://adlnet.gov/expapi/verbs/viewed",
      object: "módulo de disciplina",
    },
    { verb: "http://adlnet.gov/expapi/verbs/viewed", object: "discussão" },
    { verb: "http://activitystrea.ms/schema/1.0/update", object: "tópico" },
    {
      verb: "http://diogomcosta.com/xapi/verb/published",
      object: "conteúdo",
    },
  ],
};

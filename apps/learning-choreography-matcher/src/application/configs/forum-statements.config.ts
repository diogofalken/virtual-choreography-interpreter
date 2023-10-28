/**
 * This file contains all the configs related with Forum that were identified in the State of the art
 * The proccess of a config creation is described in the dissertation
 */

import { randomUUID } from "crypto";
import { Statement } from "shared/entities";
import { EadStatement } from "../../domain/types/ead-statements.type";

export enum EadForumStatementId {
  CREATE_TOPIC_AND_PUBLISH_CONTENT = "CREATE_TOPIC_AND_PUBLISH_CONTENT",
  UPDATE_TOPIC_AND_PUBLISH_CONTENT = "UPDATE_TOPIC_AND_PUBLISH_CONTENT",
  VIEW_DISCUSSION = "VIEW_DISCUSSION",
}

export const FORUM_STATEMENT_RULES: Record<
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
  [EadForumStatementId.VIEW_DISCUSSION]: [
    {
      verb: "http://adlnet.gov/expapi/verbs/viewed",
      object: "discussão",
    },
  ],
};

export const FORUM_GENERATE_STATEMENTS: Record<EadForumStatementId, Statement> =
  {
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
    [EadForumStatementId.VIEW_DISCUSSION]: new Statement({
      id: "{{ randomUUID }}",
      sourceId: "ead-forum",
      actor: {
        id: "{{ randomUUID }}",
        name: "{{ actor }}",
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/viewed",
        display: "visualizou",
      },
      object: {
        id: "{{ randomUUID }}",
        definition: {
          name: "discussão",
        },
      },
      place: {
        id: "{{ randomUUID }}",
        name: "{{ place }}",
      },
    }),
  };

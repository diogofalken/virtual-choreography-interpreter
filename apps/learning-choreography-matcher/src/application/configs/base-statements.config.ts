import {
  EadForumStatementId,
  FORUM_GENERATE_STATEMENTS,
  FORUM_STATEMENT_RULES,
} from "./forum-statements.config";

// GENERAL: You will add here all the configs that you want the algorithm to identify

export type EaDStatementType = keyof typeof EadForumStatementId;

export const EAD_STATEMENT_RULES = { ...FORUM_STATEMENT_RULES };

export const EAD_GENERATE_STATEMENTS = { ...FORUM_GENERATE_STATEMENTS };

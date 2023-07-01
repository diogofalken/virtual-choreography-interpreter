import { randomUUID } from "crypto";
import { Choreography, Statement } from "shared/entities";
import {
  EadForumStatementId,
  EadStatement,
  GENERATE_FORUM_STATEMENTS,
  MOODLE_STATEMENT_MATCH,
} from "../../ead-statements";
import { StatementMatcherHelper } from "../helpers/statement-matcher.helper";

type GetVirtualChoreographiesUseCaseInput = {
  statements: Statement[];
};
type GetVirtualChoreographiesUseCaseOutput = {
  choreographies: Choreography[];
};

export class GetVirtualChoreographiesUseCase {
  async execute(
    input: GetVirtualChoreographiesUseCaseInput
  ): Promise<GetVirtualChoreographiesUseCaseOutput | null> {
    const statementsByActorMap = new Map<string, Statement[]>();

    // Group statements by actor
    for (const statement of input.statements) {
      const cur = statementsByActorMap.get(statement.actor.name);
      if (cur) {
        cur.push(statement);
      } else {
        statementsByActorMap.set(statement.actor.name, [statement]);
      }
    }

    // Order the statements by place and then by timestamp
    for (const statements of statementsByActorMap.values()) {
      statements.sort((a, b) => {
        if (a.place.name === b.place.name) {
          // If places are the same, sort by timestamp
          return (
            new Date(a.context?.extensions.timestamp ?? "").getTime() -
            new Date(b.context?.extensions.timestamp ?? "").getTime()
          );
        } else {
          // Otherwise, sort by place
          return a.place.name.localeCompare(b.place.name);
        }
      });
    }

    // Algorithm
    const statementMatcherHelper = new StatementMatcherHelper();
    for (const actorStatements of statementsByActorMap.values()) {
      for (const placeStatements of statementMatcherHelper
        .getStatementsByPlace(actorStatements)
        .values()) {
        for (const [eadKey, eadStatements] of Object.entries(
          MOODLE_STATEMENT_MATCH
        )) {
          const matchedSequences = this.findMatchingSequences(
            placeStatements,
            eadStatements
          );

          if (matchedSequences.length > 0) {
            console.log(
              eadKey,
              matchedSequences.map((s) =>
                s.map(
                  (s: Statement) =>
                    `${new Date(
                      s.context?.extensions.timestamp ?? ""
                    ).toLocaleString("pt-PT")} - ${s.actor.name} ${
                      s.verb.display
                    } ${s.object.definition.name} no ${s.place.name}`
                )
              ),
              matchedSequences.map((s) => {
                if (s.length > 0) {
                  const eadStatement = this.transformIntoEadStatement(
                    s[0],
                    eadKey as keyof typeof EadForumStatementId
                  );
                  return `${eadStatement.actor.name} ${eadStatement.verb.display} ${eadStatement.object.definition.name} no ${eadStatement.place.name}`;
                }
              })
            );
            break;
          }
        }
      }
    }

    return null;
  }

  private findMatchingSequences(
    statements: Statement[],
    sequenceToMatch: EadStatement[]
  ): Statement[][] {
    const statementMatcherHelper = new StatementMatcherHelper();

    const matchedSequences: Statement[][] = [];
    let matchedStatements: Statement[] = [];
    let remainingStatements = [...statements];

    while (remainingStatements.length > 0) {
      for (const element of sequenceToMatch) {
        const matchingStatementIndex = remainingStatements.findIndex(
          (statement) => statementMatcherHelper.compare(statement, element)
        );

        if (matchingStatementIndex !== -1) {
          const matchingStatement = remainingStatements[matchingStatementIndex];
          matchedStatements.push(matchingStatement);
          remainingStatements.splice(0, matchingStatementIndex);

          if (matchedStatements.length === sequenceToMatch.length) {
            matchedSequences.push([...matchedStatements]);
            matchedStatements = [];
            break;
          }
        } else {
          remainingStatements = [];
          break;
        }
      }
    }

    return matchedSequences;
  }

  private transformIntoEadStatement(
    statement: Statement,
    key: keyof typeof EadForumStatementId
  ): Statement {
    const regex = new RegExp(/{{\s*(\w+)\s*}}/gi);

    let generateStringified = JSON.stringify(
      GENERATE_FORUM_STATEMENTS[key]?.toJson()
    );

    const matches = (generateStringified.match(regex) || []).map((e) =>
      e.replace(regex, "$1")
    );

    const jsonStatement = statement.toJson();

    (matches as ("randomUUID" | keyof EadStatement)[]).forEach((match) => {
      let value = "";
      switch (match) {
        case "randomUUID":
          value = randomUUID();
          break;
        case "actor":
          value = jsonStatement.actor.name;
          break;
        case "place":
          value = jsonStatement.place.name;
          break;
        case "verb":
          value = jsonStatement.verb.display;
          break;
        case "object":
          value = jsonStatement.object.definition.name;
          break;
      }
      generateStringified = generateStringified.replace(
        `{{ ${match} }}`,
        value
      );
    });

    return new Statement({ ...JSON.parse(generateStringified) });
  }
}

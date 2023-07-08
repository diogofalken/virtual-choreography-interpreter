import { randomUUID } from "crypto";
import { Choreography, Statement } from "shared/entities";
import { EadStatement } from "../../domain/types/ead-statements.type";
import {
  EAD_GENERATE_STATEMENTS,
  EAD_STATEMENT_RULES,
  EaDStatementType,
} from "../configs/base-statements.config";
import { StatementMatcherHelper } from "../helpers/statement-matcher.helper";

type GetVirtualChoreographiesUseCaseInput = {
  statements: Statement[];
};
type GetVirtualChoreographiesUseCaseOutput = Choreography[];

export class GetVirtualChoreographiesUseCase {
  async execute(
    input: GetVirtualChoreographiesUseCaseInput
  ): Promise<GetVirtualChoreographiesUseCaseOutput> {
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
    const choreographies: Choreography[] = [];
    for (const actorStatements of statementsByActorMap.values()) {
      for (const placeStatements of statementMatcherHelper
        .getStatementsByPlace(actorStatements)
        .values()) {
        let curStatements = [...placeStatements];
        for (const [eadKey, eadStatements] of Object.entries(
          EAD_STATEMENT_RULES
        )) {
          const matchedSequences = this.findMatchingSequences(
            curStatements,
            eadStatements
          );

          if (matchedSequences.length > 0) {
            // console.log(
            //   eadKey,
            //   matchedSequences.map((s) =>
            //     s.map((s: Statement) => s.toNaturalLanguage(true))
            //   ),
            //   matchedSequences.map((s) => {
            //     if (s.length > 0) {
            //       const eadStatement = this.transformIntoEadStatement(
            //         s[0],
            //         eadKey as EaDStatementType
            //       );
            //       return `${eadStatement.actor.name} ${eadStatement.verb.display} ${eadStatement.object.definition.name} no ${eadStatement.place.name}`;
            //     }
            //   })
            // );

            for (const matchedSequence of matchedSequences) {
              choreographies.push(
                new Choreography({
                  name: eadKey,
                  statements: [
                    this.transformIntoEadStatement(
                      matchedSequence[matchedSequence.length - 1],
                      eadKey as EaDStatementType
                    ),
                  ],
                })
              );
            }

            // Remove the statements that were matched
            const statementsToRemove = matchedSequences.flat().map((s) => s.id);
            curStatements = placeStatements.filter(
              (s) => !statementsToRemove.includes(s.id)
            );
          }
        }
      }
    }

    return choreographies;
  }

  private findMatchingSequences(
    statements: Statement[],
    sequenceToMatch: EadStatement[]
  ): Statement[][] {
    const statementMatcherHelper = new StatementMatcherHelper();

    const matchedSequences: Statement[][] = [];
    let matchedStatements: Statement[] = [];
    let lastMatchedStatementIndex = -1;

    for (let i = 0; i < statements.length; i++) {
      const currentStatement = statements[i];

      if (
        statementMatcherHelper.compare(
          currentStatement,
          sequenceToMatch[matchedStatements.length]
        )
      ) {
        matchedStatements.push(currentStatement);
        lastMatchedStatementIndex = i;

        if (matchedStatements.length === sequenceToMatch.length) {
          matchedSequences.push(matchedStatements);
          matchedStatements = [];
        }
      } else if (lastMatchedStatementIndex !== -1) {
        const lastMatchedStatement = statements[lastMatchedStatementIndex];
        const timeDiff = statementMatcherHelper.getTimeDifferenceInMS(
          currentStatement,
          lastMatchedStatement
        );

        if (timeDiff > 10800000) {
          matchedStatements = [];
          lastMatchedStatementIndex = -1;
        }
      }
    }

    return matchedSequences;
  }

  private transformIntoEadStatement(
    statement: Statement,
    key: EaDStatementType
  ): Statement {
    const regex = new RegExp(/{{\s*(\w+)\s*}}/gi);

    let generateStringified = JSON.stringify(
      EAD_GENERATE_STATEMENTS[key]?.toJson()
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

    return new Statement({
      ...JSON.parse(generateStringified),
      context: {
        extensions: { timestamp: jsonStatement.context?.extensions.timestamp },
      },
    });
  }
}

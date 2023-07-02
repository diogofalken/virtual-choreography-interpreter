import { Statement } from "shared/entities";

type EadStatement = {
  actor?: string;
  verb?: string;
  object?: string;
  place?: string;
};

export class StatementMatcherHelper {
  public compare(statement: Statement, eadStatement: EadStatement): boolean {
    const jsonStatement = statement.toJson();
    for (const [key, value] of Object.entries(eadStatement)) {
      const json = JSON.stringify(
        jsonStatement[key as keyof Statement["toJson"]]
      );

      if (!json || !json.includes(value)) {
        return false;
      }
    }

    return true;
  }

  public getStatementsByPlace(statements: Statement[]) {
    const statementsByPlaceMap = new Map<string, Statement[]>();

    for (const statement of statements) {
      const cur = statementsByPlaceMap.get(statement.place.id);
      if (cur) {
        cur.push(statement);
      } else {
        statementsByPlaceMap.set(statement.place.id, [statement]);
      }
    }

    return statementsByPlaceMap;
  }

  public getTimeDifferenceInMS(s1: Statement, s2: Statement): number {
    const s1Time = new Date(s1.context?.extensions.timestamp ?? "").getTime();
    const s2Time = new Date(s2.context?.extensions.timestamp ?? "").getTime();
    return s1Time - s2Time;
  }
}

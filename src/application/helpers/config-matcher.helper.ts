import { randomUUID } from "node:crypto";
import { MatchConfigTypes } from "../../config/base.config";
import { MOODLE_CONFIG } from "../../config/moodle.config";
import { Statement } from "../../domain/entities/statement.entity";

export class ConfigMatcherHelper {
  convertLog(config: MatchConfigTypes, log: Record<string, string>) {
    switch (config) {
      case "MOODLE_CONFIG":
        return this.matchMoodleConfig(log);
      default:
        return;
    }
  }

  private matchMoodleConfig(
    log: Record<string, string>
  ): Statement | undefined {
    const config = MOODLE_CONFIG;

    for (const rule of config) {
      const { pattern, generate } = rule;

      if (pattern.event.pt === log.eventName) {
        const regex = new RegExp(/{{\s*(\w+)\s*}}/gi);

        let generateStringified = JSON.stringify(generate);

        const matches = (generateStringified.match(regex) || []).map((e) =>
          e.replace(regex, "$1")
        );

        matches.forEach((match: string) => {
          let value = log[match] ?? "";

          if (match === "randomUUID") {
            value = randomUUID();
          }

          generateStringified = generateStringified.replace(
            `{{ ${match} }}`,
            value
          );
        });

        return new Statement(JSON.parse(generateStringified));
      }
    }
  }
}

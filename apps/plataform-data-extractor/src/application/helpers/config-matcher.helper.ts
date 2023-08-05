import { randomUUID } from "node:crypto";
import { Statement } from "shared/entities";
import { BaseRuleConfig, MatchConfigTypes } from "../../config/base.config";
import { MOODLE_CONFIG } from "../../config/moodle.config";

export class ConfigMatcherHelper {
  convertLog(
    config: MatchConfigTypes,
    log: Record<string, string>,
    sourceId: string
  ) {
    switch (config) {
      case "MOODLE_CONFIG":
        return this.matchConfig(MOODLE_CONFIG, log, sourceId);
      default:
        return;
    }
  }

  private matchConfig(
    config: BaseRuleConfig[],
    log: Record<string, string>,
    sourceId: string
  ): Statement | undefined {
    for (const rule of config) {
      const { pattern, generate } = rule;

      try {
        if (pattern) {
          for (const key of Object.keys(pattern)) {
            if (pattern[key].pt === log[key]) {
              return this.transformLog(log, generate, sourceId);
            }
          }
        } else {
          return this.transformLog(log, generate, sourceId);
        }
      } catch (err) {
        console.error(err, log);
      }
    }
  }

  private transformLog(
    log: Record<string, string>,
    generate: BaseRuleConfig["generate"],
    sourceId: string
  ) {
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

    return new Statement({
      ...JSON.parse(generateStringified),
      sourceId,
    });
  }
}

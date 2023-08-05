import {
  ActorType,
  ContextType,
  LanguageKeys,
  ObjectType,
  PlaceType,
  VerbType,
} from "shared/types";
import { MoodleLog } from "./moodle.config";

export type BaseRuleConfig = {
  pattern:
    | undefined
    | {
        [key: string]: Record<LanguageKeys, string>;
      };
  generate: {
    actor: ActorType;
    verb: VerbType;
    object: ObjectType;
    place: PlaceType;
    context: ContextType;
  };
};

export type LogTypeByConfig = {
  MOODLE_CONFIG: MoodleLog;
};

export type MatchConfigTypes = "MOODLE_CONFIG";

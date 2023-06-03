import { LanguageKeys } from "../domain/types/languages.types";
import {
  ActorType,
  ContextType,
  ObjectType,
  PlaceType,
  VerbType,
} from "../domain/types/xapi-elements.types";
import { MoodleLog } from "./moodle.config";

export type BaseRuleConfig = {
  pattern: {
    event: Record<LanguageKeys, string>;
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

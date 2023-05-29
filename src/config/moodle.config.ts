import { LanguageKeys } from "../domain/types/languages.types";
import {
  ActorType,
  ContextType,
  ObjectType,
  PlaceType,
  VerbType,
} from "../domain/types/xapi-elements.types";

type FileColumns = {
  timestamp: string;
  name: string;
  user: string;
  context: string;
  component: string;
  eventName: string;
  description: string;
  origin: string;
  ip: string;
};

export type MoodleLog = Map<keyof FileColumns, string>;

type MoodleRuleConfig = {
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

export const MOODLE_CONFIG: MoodleRuleConfig[] = [
  {
    pattern: {
      event: {
        "en-us": "Viewed course module",
        pt: "Módulo de disciplina visualizado",
      },
    },
    generate: {
      actor: {
        id: "{{ randomUUID }}",
        name: "{{ username }}",
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/viewed",
        display: {
          "en-us": "viewed",
          pt: "visualizou",
        },
      },
      object: {
        id: "{{ randomUuid }}",
        definition: {
          name: {
            "en-us": "{{ event_context }}",
            pt: "{{ event_context }}",
          },
        },
      },
      place: {
        id: "{{ randomUuid }}",
        name: "{{ component }}",
      },
      context: {
        id: "{{ randomUuid }}",
        extensions: {
          timestamp: "{{ timestamp }}",
          description: "{{ description }}",
          event: "{{ event_name }}",
        },
      },
    },
  },
];

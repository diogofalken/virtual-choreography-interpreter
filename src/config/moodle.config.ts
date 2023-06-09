import { BaseRuleConfig } from "./base.config";

type FileColumns = {
  timestamp: string;
  username: string;
  affectedUser: string;
  context: string;
  component: string;
  eventName: string;
  description: string;
  origin: string;
  ip: string;
};

export type MoodleLog = Record<keyof FileColumns, string>;

export const MOODLE_CONFIG: BaseRuleConfig[] = [
  {
    pattern: {
      eventName: {
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
        display: "visualizou",
      },
      object: {
        id: "{{ randomUUID }}",
        definition: {
          name: "{{ context }}",
        },
      },
      place: {
        id: "{{ randomUUID }}",
        name: "{{ component }}",
      },
      context: {
        id: "{{ randomUUID }}",
        extensions: {
          timestamp: "{{ timestamp }}",
          description: "{{ description }}",
          event: "{{ eventName }}",
        },
      },
    },
  },
];

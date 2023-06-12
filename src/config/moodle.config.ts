import { BaseRuleConfig } from "./base.config";

export const MoodleFileColumns = [
  "timestamp",
  "username",
  "affectedUser",
  "context",
  "component",
  "eventName",
  "description",
  "origin",
  "ip",
] as const;

export type MoodleLog = Record<(typeof MoodleFileColumns)[number], string>;

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

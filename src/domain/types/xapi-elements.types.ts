import { LanguageKeys } from "./languages.types";

export type ActorType = {
  id: string;
  name: string;
};

export type VerbType = {
  id: string;
  display: { [key in LanguageKeys]: string };
};

export type ObjectType = {
  id: string;
  definition: { name: { [key in LanguageKeys]: string } };
};

export type PlaceType = {
  id: string;
  name: string;
};

export type ContextType = {
  id: string;
  extensions: {
    timestamp: string;
    description: string;
    event: string;
  };
};

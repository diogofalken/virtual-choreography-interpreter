/**
 * In the future if we want to extend this to multiple
 * languages we can use the following structure:
 * definition: { name: { [key in LanguageKeys]: string } };
 */

export type ActorType = { id: string; name: string };

export type VerbType = {
  id: string;
  display: string;
};

export type ObjectType = {
  id: string;
  definition: { name: string };
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

export type Store = {
  get: <T>(key?: string[]) => T | undefined;
};

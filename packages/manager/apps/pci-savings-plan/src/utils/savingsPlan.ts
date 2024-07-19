export const REGEX = '^[a-zA-Z0-9_-]{1,60}$';

export const isValidSavingsPlanName = (name: string): boolean => {
  return new RegExp(REGEX).test(name);
};

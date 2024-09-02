export const REGEX = '^[-_a-zA-Z0-9]{1,61}$';

export const isValidSavingsPlanName = (name: string): boolean => {
  return new RegExp(REGEX).test(name);
};

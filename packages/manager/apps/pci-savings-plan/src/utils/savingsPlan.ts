export const isValidSavingsPlanName = (name: string): boolean => {
  return /^[-_a-zA-Z0-9]+$/.test(name);
};

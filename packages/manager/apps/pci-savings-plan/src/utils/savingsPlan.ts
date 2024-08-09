export const isValidSavingsPlanName = (name: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(name);
};


export const startCaseFormat = (str: string) => {
  if (!str) return '';

  // Replace underscores and dashes with spaces
  // Also split camelCase and PascalCase words by inserting spaces before uppercase letters
  // Then split by spaces to get words
  const words = str
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[_-]+/g, ' ') // replace underscores and dashes with space
    .trim()
    .split(/\s+/);

  // Capitalize the first letter of each word
  const result = words
    .map((word) => {
      if (word.length === 0) return '';
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return result;
};

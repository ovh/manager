export const replaceAll = (str: string, obj: Record<string, string>): string => {
  if (!str) return str;
  let replaced = str;
  Object.keys(obj).forEach((key) => {
    replaced = replaced.replace(new RegExp(escapeRegExp(key), 'g'), obj[key]);
  });
  return replaced;
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // échappe les caractères spéciaux
};

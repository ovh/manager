export const replaceAll = (str: string, obj: Record<string, string>) => {
  let replaced = str;

  Object.keys(obj).forEach((key) => {
    replaced = replaced.replace(new RegExp(key, 'g'), obj[key]);
  });

  return replaced;
};

export const capitalize = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

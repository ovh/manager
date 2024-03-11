// eslint-disable-next-line import/prefer-default-export
export const isValidRancherName = (name: string) =>
  /^[a-z0-9._-]{3,63}$/.test(name);

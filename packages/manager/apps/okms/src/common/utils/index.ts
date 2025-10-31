// eslint-disable-next-line import/prefer-default-export
export const isValidOkmsName = (name: string) =>
  /^[a-z0-9][-_.A-Za-z0-9]{1,61}[a-z0-9]$/.test(name);

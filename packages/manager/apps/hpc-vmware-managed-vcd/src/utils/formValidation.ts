export const validateOrganizationName = (name: string) =>
  /^.{1,128}$/.test(name);

export const validateDescription = (desc: string) => /^.{1,256}$/.test(desc);

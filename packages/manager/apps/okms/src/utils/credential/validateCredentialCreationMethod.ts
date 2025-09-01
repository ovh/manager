export const CredentialCreationMethodErrors = {
  required: 'REQUIRED',
} as const;

export type CredentialCreationMethodErrorsType = typeof CredentialCreationMethodErrors[keyof typeof CredentialCreationMethodErrors];

export const validateCredentialCreationMethod = (csr: string | null) => {
  if (csr?.length === 0) return CredentialCreationMethodErrors.required;

  return undefined;
};

/* RULES
 * - min 1 character
 * - max 50 characters
 * - valid characters: ASCII characters from "space" to "~"
 */

export const CredentialNameErrors = {
  required: 'REQUIRED',
  invalidCharacters: 'INVALID_CHARACTERS',
  tooManyCharacters: 'TOO_MANY_CHARACTERS',
} as const;

export type CredentialNameErrorsType = typeof CredentialNameErrors[keyof typeof CredentialNameErrors];

export const credentialNameMaxCharacters = 50;

export const validateCredentialName = (name: string) => {
  if (name.length === 0) return CredentialNameErrors.required;

  if (name.length > credentialNameMaxCharacters)
    return CredentialNameErrors.tooManyCharacters;

  if (!/^[ -~]+$/.test(name)) return CredentialNameErrors.invalidCharacters;

  return undefined;
};

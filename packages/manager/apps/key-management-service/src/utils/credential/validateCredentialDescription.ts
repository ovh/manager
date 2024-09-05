/* RULES
 * - min 1 character
 * - max 200 characters
 * - valid characters: ASCII characters from "space" to "~"
 */

export const CredentialDescriptionErrors = {
  invalidCharacters: 'INVALID_CHARACTERS',
  tooManyCharacters: 'TOO_MANY_CHARACTERS',
} as const;

export type CredentialDescriptionErrorsType = typeof CredentialDescriptionErrors[keyof typeof CredentialDescriptionErrors];

export const CredentialDescriptionMaxCharacters = 200;

export const validateCredentialDescription = (description: string | null) => {
  if (!description) return undefined;
  if (description.length > CredentialDescriptionMaxCharacters)
    return CredentialDescriptionErrors.tooManyCharacters;

  if (!/^[ -~]+$/.test(description))
    return CredentialDescriptionErrors.invalidCharacters;

  return undefined;
};

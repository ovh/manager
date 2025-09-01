/* RULES
 * - min 1 character
 * - max 32 characters
 * - valid characters: ASCII characters from "space" to "~"
 */

export const ServiceKeyNameErrors = {
  required: 'REQUIRED',
  invalidCharacters: 'INVALID_CHARACTERS',
  tooManyCharacters: 'TOO_MANY_CHARACTERS',
} as const;

export type ServiceKeyNameErrors = typeof ServiceKeyNameErrors[keyof typeof ServiceKeyNameErrors];

export const serviceKeyMaxCharacters = 32;

export const validateServiceKeyName = (name: string) => {
  if (name.length === 0) return ServiceKeyNameErrors.required;

  if (name.length > 32) return ServiceKeyNameErrors.tooManyCharacters;

  if (!/^[ -~]+$/.test(name)) return ServiceKeyNameErrors.invalidCharacters;

  return undefined;
};

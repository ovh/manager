import { describe, expect, it } from 'vitest';
import {
  serviceKeyMaxCharacters,
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from './validateServiceKeyName';

describe('Service key name validation test suite', () => {
  it('should return the right error message when name is empty.', () => {
    // given
    const emptyName = '';

    // when
    const result = validateServiceKeyName(emptyName);

    // then
    expect(result).toBe(ServiceKeyNameErrors.required);
  });

  it('should return the right error message when name is too long.', () => {
    // given
    const tooLongName = 'a'.repeat(serviceKeyMaxCharacters + 1);

    // when
    const result = validateServiceKeyName(tooLongName);

    // then
    expect(result).toBe(ServiceKeyNameErrors.tooManyCharacters);
  });

  it('should return the right error message when name contains invalid characters.', () => {
    // given
    const invalidName = '§';

    // when
    const result = validateServiceKeyName(invalidName);

    // then
    expect(result).toBe(ServiceKeyNameErrors.invalidCharacters);
  });
});

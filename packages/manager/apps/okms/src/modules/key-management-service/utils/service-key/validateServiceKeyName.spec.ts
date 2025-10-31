import { describe, expect } from 'vitest';
import {
  serviceKeyMaxCharacters,
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from './validateServiceKeyName';

describe('Service key name validation test suite', () => {
  const useCases: {
    name: string;
    usecase: string;
    error: ServiceKeyNameErrors;
  }[] = [
    {
      name: '',
      usecase: 'should return the right error message when name is empty.',
      error: ServiceKeyNameErrors.required,
    },
    {
      name: 'a'.repeat(serviceKeyMaxCharacters + 1),
      usecase: 'should return the right error message when name is too long.',
      error: ServiceKeyNameErrors.tooManyCharacters,
    },
    {
      name: '§',
      usecase:
        'should return the right error message when name contains invalid characters.',
      error: ServiceKeyNameErrors.invalidCharacters,
    },
  ];

  test.each(useCases)('$usecase', ({ name, error }) => {
    // given name

    // when
    const result = validateServiceKeyName(name);

    // then
    expect(result).toBe(error);
  });
});

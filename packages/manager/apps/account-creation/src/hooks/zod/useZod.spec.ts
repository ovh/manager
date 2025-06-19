import { describe, it, expect } from 'vitest';
import { useZodSchemaGenerator, useZodTranslatedError } from './useZod';
import { Rule } from '@/types/rule';

const emptyRule: Rule = {
  defaultValue: null,
  examples: null,
  fieldName: '',
  in: null,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
  mandatory: true,
};

describe('useZodSchemaGenerator', () => {
  it('should generate a basic required string schema', () => {
    const fields = {
      name: emptyRule,
    };

    const schema = useZodSchemaGenerator(fields);

    // Should pass
    expect(() => schema.parse({ name: 'John' })).not.toThrow();

    // Should fail
    expect(() => schema.parse({})).toThrow();
    expect(() => schema.parse({ name: '' })).toThrow();
  });

  it('should handle optional fields', () => {
    const fields: Record<string, Rule> = {
      name: {
        ...emptyRule,
        mandatory: false,
      },
    };

    const schema = useZodSchemaGenerator(fields);

    // All should pass
    expect(() => schema.parse({})).not.toThrow();
    expect(() => schema.parse({ name: 'John' })).not.toThrow();
    expect(() => schema.parse({ name: undefined })).not.toThrow();
  });

  it('should validate field length constraints', () => {
    const fields: Record<string, Rule> = {
      name: {
        ...emptyRule,
        minLength: 2,
        maxLength: 5,
      },
    };

    const schema = useZodSchemaGenerator(fields);

    // Should pass
    expect(() => schema.parse({ name: 'John' })).not.toThrow();

    // Should fail
    expect(() => schema.parse({ name: 'J' })).toThrow();
    expect(() => schema.parse({ name: 'Johannes' })).toThrow();
  });

  it('should validate enum (in) constraints', () => {
    const fields = {
      country: {
        ...emptyRule,
        in: ['FR', 'US', 'UK'],
      },
    };

    const schema = useZodSchemaGenerator(fields);

    // Should pass
    expect(() => schema.parse({ country: 'FR' })).not.Throw();

    // Should fail
    expect(() => schema.parse({ country: 'DE' })).toThrow();
  });

  it('should validate regex patterns', () => {
    const fields = {
      email: {
        ...emptyRule,
        regularExpression: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
    };

    const schema = useZodSchemaGenerator(fields);

    // Should pass
    expect(() => schema.parse({ email: 'test@example.com' })).not.toThrow();

    // Should fail
    expect(() => schema.parse({ email: 'invalid-email' })).toThrow();
  });

  it('should validate prefix constraints', () => {
    const fields = {
      phone: {
        ...emptyRule,
        prefix: '+1',
      },
    };

    const schema = useZodSchemaGenerator(fields);

    // Should pass
    expect(() => schema.parse({ phone: '+1234567890' })).not.toThrow();

    // Should fail
    expect(schema.safeParse({ phone: '1234567890' }).success).toBeFalsy();
  });
});

describe('useZodTranslatedError', () => {
  it('should return max chars error with value', () => {
    const rule: Rule = {
      ...emptyRule,
      maxLength: 10,
    };

    const result = useZodTranslatedError('error_max_chars', rule);

    expect(result).toEqual({
      key: 'error_max_chars',
      options: { value: 10 },
    });
  });

  it('should return min chars error with value', () => {
    const rule: Rule = {
      ...emptyRule,
      minLength: 5,
    };

    const result = useZodTranslatedError('error_min_chars', rule);

    expect(result).toEqual({
      key: 'error_min_chars',
      options: { value: 5 },
    });
  });

  it('should return default error message for unknown errors', () => {
    const result = useZodTranslatedError('unknown_error', emptyRule);

    expect(result).toEqual({
      key: 'unknown_error',
    });
  });

  it('should handle missing length values', () => {
    const maxResult = useZodTranslatedError('error_max_chars', emptyRule);
    const minResult = useZodTranslatedError('error_min_chars', emptyRule);

    expect(maxResult).toEqual({
      key: 'error_max_chars',
      options: { value: 0 },
    });

    expect(minResult).toEqual({
      key: 'error_min_chars',
      options: { value: 0 },
    });
  });
});

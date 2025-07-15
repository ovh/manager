import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';
import {
  MOCK_PATH_INVALID_CHARACTERS_NOT_ALLOWED,
  MOCK_PATH_INVALID_CONTAINS_TWO_CONSECUTIVE_SLASHES,
  MOCK_PATH_INVALID_ENDS_WITH_SLASH,
  MOCK_PATH_INVALID_STARTS_WITH_SLASH,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constant';
import { renderHook } from '@testing-library/react';
import {
  PATH_MAX_CHAR,
  PATH_MIN_CHAR,
  useSecretPathSchema,
} from './pathSchema';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';

let i18nValue: i18n;

const getSchemaParsingResult = (input: string) => {
  const schema = renderHook(useSecretPathSchema, {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18nValue}>{children}</I18nextProvider>
    ),
  });
  return schema.result.current.safeParse(input);
};

describe('PathSchema test suite', () => {
  beforeAll(async () => {
    i18nValue = await initTestI18n();
  });
  it('should validate a valid path', () => {
    const path = MOCK_PATH_VALID;
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(true);
    expect(result.data).toBe(path);
  });

  it('should return the correct error message for an undefined message', () => {
    const result = getSchemaParsingResult(undefined);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.common.form.required_field,
    );
  });

  it('should return the correct error message for a path with disallowed characters', () => {
    const path = MOCK_PATH_INVALID_CHARACTERS_NOT_ALLOWED;
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.secretManager.create.path_error_allowed_characters,
    );
  });

  it.each([
    MOCK_PATH_INVALID_STARTS_WITH_SLASH,
    MOCK_PATH_INVALID_ENDS_WITH_SLASH,
    MOCK_PATH_INVALID_CONTAINS_TWO_CONSECUTIVE_SLASHES,
  ])(
    'should return the correct error message for an incorrect structured path: %s',
    (path) => {
      const result = getSchemaParsingResult(path);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        labels.secretManager.create.path_error_structure,
      );
    },
  );

  it('should return the correct error message for a path that is too short', () => {
    const path = 'a'.repeat(PATH_MIN_CHAR - 1);
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.common.form.required_field,
    );
  });

  it('should return the correct error message for a path that is too long', () => {
    const path = 'a'.repeat(PATH_MAX_CHAR + 1);
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.common.form.error_max_chars.replace(
        '{{ value }}',
        PATH_MAX_CHAR.toString(),
      ),
    );
  });
});

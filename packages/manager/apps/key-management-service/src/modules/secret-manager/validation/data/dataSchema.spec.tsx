import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';
import { renderHook } from '@testing-library/react';
import {
  MOCK_DATA_INVALID_JSON,
  MOCK_DATA_VALID_ARRAY_JSON,
  MOCK_DATA_VALID_JSON,
} from '@secret-manager/utils/tests/secret.constants';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import { DATA_MIN_CHAR, useSecretDataSchema } from './dataSchema';

let i18nValue: i18n;

const getSchemaParsingResult = (input: string) => {
  const schema = renderHook(useSecretDataSchema, {
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
  it('should validate a valid JSON data', () => {
    const path = MOCK_DATA_VALID_JSON;
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

  it('should return the correct error message for a data that is too short', () => {
    const data = 'a'.repeat(DATA_MIN_CHAR - 1);
    const result = getSchemaParsingResult(data);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.common.form.required_field,
    );
  });

  it('should return the correct error message for an valid array JSON', () => {
    const path = MOCK_DATA_VALID_ARRAY_JSON;
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.secretManager.create.data_error_invalid_json,
    );
  });

  it('should return the correct error message for an invalid JSON', () => {
    const path = MOCK_DATA_INVALID_JSON;
    const result = getSchemaParsingResult(path);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      labels.secretManager.create.data_error_invalid_json,
    );
  });
});

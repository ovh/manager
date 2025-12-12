import {
  MOCK_DATA_INVALID_JSON,
  MOCK_DATA_VALID_JSON,
} from '@secret-manager/utils/tests/secret.constants';
import { renderHook } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';

import { useCustomMetadataSchema } from './customMetadataSchema';

let i18nValue: i18n;

const getSchemaParsingResult = (input: string | undefined) => {
  const schema = renderHook(useCustomMetadataSchema, {
    wrapper: ({ children }) => <I18nextProvider i18n={i18nValue}>{children}</I18nextProvider>,
  });
  return schema.result.current.safeParse(input);
};

describe('CustomMetadataSchema test suite', () => {
  beforeAll(async () => {
    i18nValue = await initTestI18n();
  });

  it('should validate a valid JSON', () => {
    const validJson = MOCK_DATA_VALID_JSON;
    const result = getSchemaParsingResult(validJson);
    expect(result.success).toBe(true);
    expect(result.data).toBe(validJson);
  });

  it('should return the correct error message for JSON with empty key', () => {
    const jsonWithEmptyKey = '{"": "value", "key2": "value2"}';
    const result = getSchemaParsingResult(jsonWithEmptyKey);
    expect(result.success).toBe(false);
    expect(result.error?.issues?.[0]?.message).toBe(labels.secretManager.error_empty_keys);
  });

  it('should validate invalid JSON (catch block returns true)', () => {
    const invalidJson = MOCK_DATA_INVALID_JSON;
    const result = getSchemaParsingResult(invalidJson);
    expect(result.success).toBe(true);
    expect(result.data).toBe(invalidJson);
  });

  it('should validate empty string (catch block returns true)', () => {
    const emptyString = '';
    const result = getSchemaParsingResult(emptyString);
    expect(result.success).toBe(true);
    expect(result.data).toBe(emptyString);
  });
});

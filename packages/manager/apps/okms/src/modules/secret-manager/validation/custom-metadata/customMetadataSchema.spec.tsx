import {
  MOCK_DATA_INVALID_JSON,
  MOCK_DATA_VALID_JSON,
} from '@secret-manager/utils/tests/secret.constants';
import { renderHook } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { useCustomMetadataSchema } from './customMetadataSchema';

const getSchemaParsingResult = async (input: string | undefined) => {
  const wrapper = await testWrapperBuilder().withI18next().build();
  const schema = renderHook(useCustomMetadataSchema, {
    wrapper: wrapper,
  });
  return schema.result.current.safeParse(input);
};

describe('CustomMetadataSchema test suite', () => {
  it('should validate a valid JSON', async () => {
    const validJson = MOCK_DATA_VALID_JSON;
    const result = await getSchemaParsingResult(validJson);
    expect(result.success).toBe(true);
    expect(result.data).toBe(validJson);
  });

  it('should return the correct error message for JSON with empty key', async () => {
    const jsonWithEmptyKey = '{"": "value", "key2": "value2"}';
    const result = await getSchemaParsingResult(jsonWithEmptyKey);
    expect(result.success).toBe(false);
    expect(result.error?.issues?.[0]?.message).toBe(labels.secretManager.error_empty_key_or_value);
  });

  it('should return the correct error message for JSON with empty value', async () => {
    const jsonWithEmptyValue = '{"key1": "", "key2": "value2"}';
    const result = await getSchemaParsingResult(jsonWithEmptyValue);
    expect(result.success).toBe(false);
    expect(result.error?.issues?.[0]?.message).toBe(labels.secretManager.error_empty_key_or_value);
  });

  it('should validate invalid JSON (catch block returns true)', async () => {
    const invalidJson = MOCK_DATA_INVALID_JSON;
    const result = await getSchemaParsingResult(invalidJson);
    expect(result.success).toBe(true);
    expect(result.data).toBe(invalidJson);
  });

  it('should validate empty string (catch block returns true)', async () => {
    const emptyString = '';
    const result = await getSchemaParsingResult(emptyString);
    expect(result.success).toBe(true);
    expect(result.data).toBe(emptyString);
  });
});

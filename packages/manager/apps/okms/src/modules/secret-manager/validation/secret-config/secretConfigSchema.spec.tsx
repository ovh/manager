import { MOCK_SECRET_CONFIG_VALID } from '@secret-manager/utils/tests/secret.constants';
import { renderHook } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';

import {
  MAX_VERSIONS_MAX_VALUE,
  MAX_VERSIONS_MIN_VALUE,
  useSecretConfigSchema,
} from './secretConfigSchema';

let i18nValue: i18n;

const getSchemaParsingResult = (input: unknown) => {
  const schema = renderHook(useSecretConfigSchema, {
    wrapper: ({ children }) => <I18nextProvider i18n={i18nValue}>{children}</I18nextProvider>,
  });
  return schema.result.current.safeParse(input);
};

describe('useSecretConfigSchema test suite', () => {
  beforeAll(async () => {
    i18nValue = await initTestI18n();
  });

  describe('Valid secret config', () => {
    it('should validate a complete valid secret config object', () => {
      const result = getSchemaParsingResult(MOCK_SECRET_CONFIG_VALID);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(MOCK_SECRET_CONFIG_VALID);
    });
  });

  describe('casRequired field validation', () => {
    it('should return error for invalid casRequired value', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        casRequired: 'invalid',
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['casRequired']);
    });

    it('should return error for missing casRequired field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { casRequired, ...invalidSecretConfig } = MOCK_SECRET_CONFIG_VALID;
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['casRequired']);
    });

    it('should return error for null casRequired', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        casRequired: null as unknown,
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['casRequired']);
    });
  });

  describe('deactivateVersionAfter field validation', () => {
    it.each<[{ desc: string; value: string }]>([
      [{ desc: 'invalid duration format', value: 'invalid-duration' }],
      [{ desc: 'duration with invalid units', value: '30x' }],
      [{ desc: 'duration with no unit', value: '30' }],
      [{ desc: 'empty string', value: '' }],
    ])('should return error for %s', ({ value }) => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        deactivateVersionAfter: value,
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['deactivateVersionAfter']);
      expect(result.error?.issues?.[0]?.message).toBe(labels.secretManager.error_invalid_duration);
    });

    it('should return error for missing deactivateVersionAfter field', () => {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deactivateVersionAfter,
        ...invalidSecretConfig
      } = MOCK_SECRET_CONFIG_VALID;
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['deactivateVersionAfter']);
    });

    it('should validate various valid duration formats', () => {
      const validDurations = ['30s', '5m', '2h', '1h30m', '45m30s', '2h15m30s', '30s15m2h'];

      validDurations.forEach((duration) => {
        const validSecretConfig = {
          ...MOCK_SECRET_CONFIG_VALID,
          deactivateVersionAfter: duration,
        };
        const result = getSchemaParsingResult(validSecretConfig);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('maxVersions field validation', () => {
    it('should validate zero maxVersions', () => {
      const validSecretConfig = { ...MOCK_SECRET_CONFIG_VALID, maxVersions: 0 };
      const result = getSchemaParsingResult(validSecretConfig);
      expect(result.success).toBe(true);
    });

    it('should validate large maxVersions', () => {
      const validSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        maxVersions: MAX_VERSIONS_MAX_VALUE,
      };
      const result = getSchemaParsingResult(validSecretConfig);
      expect(result.success).toBe(true);
    });

    it('should return error for non-numeric maxVersions', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        maxVersions: 'not-a-number',
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['maxVersions']);
    });

    it('should return error for missing maxVersions field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { maxVersions, ...invalidSecretConfig } = MOCK_SECRET_CONFIG_VALID;
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['maxVersions']);
    });

    it('should return error for null maxVersions', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        maxVersions: null as unknown,
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['maxVersions']);
    });

    it('should return error for negative maxVersions', () => {
      const validSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        maxVersions: -1,
      };
      const result = getSchemaParsingResult(validSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['maxVersions']);
      expect(result.error?.issues?.[0]?.message).toBe(
        labels.common.form.error_min_exclusive.replace(
          '{{ value }}',
          MAX_VERSIONS_MIN_VALUE.toString(),
        ),
      );
    });

    it('should return error for too large maxVersions', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        maxVersions: MAX_VERSIONS_MAX_VALUE + 1,
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues?.[0]?.path).toEqual(['maxVersions']);
      expect(result.error?.issues?.[0]?.message).toBe(
        labels.common.form.error_max_inclusive.replace(
          '{{ value }}',
          MAX_VERSIONS_MAX_VALUE.toString(),
        ),
      );
    });
  });

  describe('Multiple field validation errors', () => {
    it('should return multiple errors for invalid object with multiple issues', () => {
      const invalidSecretConfig = {
        ...MOCK_SECRET_CONFIG_VALID,
        casRequired: 'invalid',
        deactivateVersionAfter: 'invalid-duration',
        maxVersions: 'not-a-number',
      };
      const result = getSchemaParsingResult(invalidSecretConfig);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(3);
      expect(result.error?.issues?.[0]?.path).toEqual(['casRequired']);
      expect(result.error?.issues?.[1]?.path).toEqual(['deactivateVersionAfter']);
      expect(result.error?.issues?.[2]?.path).toEqual(['maxVersions']);
    });

    it('should return multiple errors for completely empty object', () => {
      const result = getSchemaParsingResult({});
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(3);
      expect(result.error?.issues?.[0]?.path).toEqual(['casRequired']);
      expect(result.error?.issues?.[1]?.path).toEqual(['deactivateVersionAfter']);
      expect(result.error?.issues?.[2]?.path).toEqual(['maxVersions']);
    });
  });

  describe('Edge cases', () => {
    it('should return error for undefined input', () => {
      const result = getSchemaParsingResult(undefined);
      expect(result.success).toBe(false);
    });

    it('should return error for null input', () => {
      const result = getSchemaParsingResult(null);
      expect(result.success).toBe(false);
    });

    it('should return error for non-object input', () => {
      const result = getSchemaParsingResult('not-an-object');
      expect(result.success).toBe(false);
    });
  });
});

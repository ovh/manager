import { mockSecretConfigReference } from '@secret-manager/mocks/secret-reference/secretReference.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret, SecretConfig } from '@secret-manager/types/secret.type';
import { describe, expect, it } from 'vitest';

import {
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
  NOT_SET_VALUE_MAX_VERSIONS,
  SecretSmartConfig,
  buildSecretSmartConfig,
} from './secretSmartConfig';

describe('buildSecretSmartConfig', () => {
  const createMockSecret = (overrides: Partial<Secret['metadata']> = {}): Secret => ({
    ...mockSecret1,
    metadata: {
      ...mockSecret1.metadata,
      ...overrides,
    },
  });

  const createMockSecretConfig = (overrides: Partial<SecretConfig> = {}): SecretConfig => ({
    casRequired: false,
    deactivateVersionAfter: '0s',
    maxVersions: 0,
    ...overrides,
  });

  // Shared test execution logic
  type TestCase = {
    description: string;
    secretOverrides: Partial<Secret['metadata']>;
    domainOverrides: Partial<SecretConfig>;
    expectedValue: string | number | boolean;
    expectedOrigin: 'SECRET' | 'DOMAIN' | 'DEFAULT';
    expectedIsCasRequiredSetOnOkms: boolean;
    expectedMaxVersionsDefault?: number;
    testedProperty: Exclude<
      keyof SecretSmartConfig,
      'isCasRequiredSetOnOkms' | 'maxVersionsDefault'
    >;
  };

  const runTests = (testCases: TestCase[]) => {
    it.each(testCases)(
      '$description',
      ({
        secretOverrides,
        domainOverrides,
        expectedValue,
        expectedOrigin,
        expectedIsCasRequiredSetOnOkms,
        expectedMaxVersionsDefault,
        testedProperty,
      }) => {
        const secret = createMockSecret(secretOverrides);
        const secretConfigOkms = createMockSecretConfig(domainOverrides);

        const result = buildSecretSmartConfig(secretConfigOkms, mockSecretConfigReference, secret);

        expect(result[testedProperty].value).toBe(expectedValue);
        expect(result[testedProperty].origin).toBe(expectedOrigin);
        expect(result.isCasRequiredSetOnOkms).toBe(expectedIsCasRequiredSetOnOkms);
        if (expectedMaxVersionsDefault) {
          expect(result.maxVersionsDefault).toBe(expectedMaxVersionsDefault);
        }
      },
    );
  };

  describe('When secret and domain config are both not set', () => {
    const testCases: TestCase[] = [
      {
        description: 'uses default maxVersion',
        secretOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        domainOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        expectedValue: 10,
        expectedOrigin: 'DEFAULT',
        expectedIsCasRequiredSetOnOkms: false,
        expectedMaxVersionsDefault: 10,
        testedProperty: 'maxVersions',
      },
      {
        description: 'uses default deactivateVersionAfter',
        secretOverrides: {
          deactivateVersionAfter: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
        },
        domainOverrides: {
          deactivateVersionAfter: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
        },
        expectedValue: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
        expectedOrigin: 'DEFAULT',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'deactivateVersionAfter',
      },
      {
        description: 'uses default casRequired',
        secretOverrides: { casRequired: false },
        domainOverrides: { casRequired: false },
        expectedValue: false,
        expectedOrigin: 'DEFAULT',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'casRequired',
      },
    ];

    runTests(testCases);
  });

  describe('When secret config is set and domain config is not set', () => {
    const testCases: TestCase[] = [
      {
        description: 'uses secret maxVersion',
        secretOverrides: { maxVersions: 5 },
        domainOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        expectedValue: 5,
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'maxVersions',
      },
      {
        description: 'uses secret deactivateVersionAfter',
        secretOverrides: { deactivateVersionAfter: '1h' },
        domainOverrides: {
          deactivateVersionAfter: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
        },
        expectedValue: '1h',
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'deactivateVersionAfter',
      },
      {
        description: 'uses secret casRequired',
        secretOverrides: { casRequired: true },
        domainOverrides: { casRequired: false },
        expectedValue: true,
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'casRequired',
      },
    ];

    runTests(testCases);
  });

  describe('When secret config is not set and domain config is set', () => {
    const testCases: TestCase[] = [
      {
        description: 'uses domain maxVersion',
        secretOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        domainOverrides: { maxVersions: 15 },
        expectedValue: 15,
        expectedOrigin: 'DOMAIN',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'maxVersions',
      },
      {
        description: 'uses domain deactivateVersionAfter',
        secretOverrides: {
          deactivateVersionAfter: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
        },
        domainOverrides: { deactivateVersionAfter: '2h' },
        expectedValue: '2h',
        expectedOrigin: 'DOMAIN',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'deactivateVersionAfter',
      },
      {
        description: 'uses domain casRequired',
        secretOverrides: { casRequired: false },
        domainOverrides: { casRequired: true },
        expectedValue: true,
        expectedOrigin: 'DOMAIN',
        expectedIsCasRequiredSetOnOkms: true,
        testedProperty: 'casRequired',
      },
    ];

    runTests(testCases);
  });

  describe('When secret and domain config are set', () => {
    const testCases: TestCase[] = [
      {
        description: 'uses secret maxVersion',
        secretOverrides: { maxVersions: 5 },
        domainOverrides: { maxVersions: 15 },
        expectedValue: 5,
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'maxVersions',
      },
      {
        description: 'uses secret deactivateVersionAfter',
        secretOverrides: { deactivateVersionAfter: '1h' },
        domainOverrides: { deactivateVersionAfter: '2h' },
        expectedValue: '1h',
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'deactivateVersionAfter',
      },
      {
        description: 'uses secret casRequired',
        secretOverrides: { casRequired: true },
        domainOverrides: { casRequired: false },
        expectedValue: true,
        expectedOrigin: 'SECRET',
        expectedIsCasRequiredSetOnOkms: false,
        testedProperty: 'casRequired',
      },
    ];

    runTests(testCases);
  });

  describe('When secret is undefined', () => {
    // Test case type for undefined secret scenarios
    type UndefinedSecretTestCase = {
      description: string;
      domainOverrides: Partial<SecretConfig>;
      expectedValue: string | number | boolean;
      expectedOrigin: 'DOMAIN' | 'DEFAULT';
      expectedIsCasRequiredSetOnOkms: boolean;
      expectedMaxVersionsDefault?: number;
      testedProperty: Exclude<
        keyof SecretSmartConfig,
        'isCasRequiredSetOnOkms' | 'maxVersionsDefault'
      >;
    };

    const runUndefinedSecretTests = (testCases: UndefinedSecretTestCase[]) => {
      it.each(testCases)(
        '$description',
        ({
          domainOverrides,
          expectedValue,
          expectedOrigin,
          expectedIsCasRequiredSetOnOkms,
          expectedMaxVersionsDefault,
          testedProperty,
        }) => {
          const secretConfigOkms = createMockSecretConfig(domainOverrides);

          const result = buildSecretSmartConfig(
            secretConfigOkms,
            mockSecretConfigReference,
            undefined,
          );

          expect(result[testedProperty].value).toBe(expectedValue);
          expect(result[testedProperty].origin).toBe(expectedOrigin);
          expect(result.isCasRequiredSetOnOkms).toBe(expectedIsCasRequiredSetOnOkms);
          if (expectedMaxVersionsDefault) {
            expect(result.maxVersionsDefault).toBe(expectedMaxVersionsDefault);
          }
        },
      );
    };

    describe('and domain config is not set', () => {
      const testCases: UndefinedSecretTestCase[] = [
        {
          description: 'uses default maxVersion',
          domainOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
          expectedValue: 10,
          expectedOrigin: 'DEFAULT',
          expectedIsCasRequiredSetOnOkms: false,
          expectedMaxVersionsDefault: 10,
          testedProperty: 'maxVersions',
        },
        {
          description: 'uses default deactivateVersionAfter',
          domainOverrides: {
            deactivateVersionAfter: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
          },
          expectedValue: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
          expectedOrigin: 'DEFAULT',
          expectedIsCasRequiredSetOnOkms: false,
          testedProperty: 'deactivateVersionAfter',
        },
        {
          description: 'uses default casRequired',
          domainOverrides: { casRequired: false },
          expectedValue: false,
          expectedOrigin: 'DEFAULT',
          expectedIsCasRequiredSetOnOkms: false,
          testedProperty: 'casRequired',
        },
      ];

      runUndefinedSecretTests(testCases);
    });

    describe('and domain config is set', () => {
      const testCases: UndefinedSecretTestCase[] = [
        {
          description: 'uses domain maxVersion',
          domainOverrides: { maxVersions: 15 },
          expectedValue: 15,
          expectedOrigin: 'DOMAIN',
          expectedIsCasRequiredSetOnOkms: false,
          testedProperty: 'maxVersions',
        },
        {
          description: 'uses domain deactivateVersionAfter',
          domainOverrides: { deactivateVersionAfter: '2h' },
          expectedValue: '2h',
          expectedOrigin: 'DOMAIN',
          expectedIsCasRequiredSetOnOkms: false,
          testedProperty: 'deactivateVersionAfter',
        },
        {
          description: 'uses domain casRequired',
          domainOverrides: { casRequired: true },
          expectedValue: true,
          expectedOrigin: 'DOMAIN',
          expectedIsCasRequiredSetOnOkms: true,
          testedProperty: 'casRequired',
        },
      ];

      runUndefinedSecretTests(testCases);
    });
  });
});

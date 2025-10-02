import { describe, it, expect } from 'vitest';
import { Secret, SecretConfig } from '@secret-manager/types/secret.type';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { mockSecretConfigReference } from '@secret-manager/mocks/secretReference/secretReference.mock';
import {
  buildSecretSmartConfig,
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
  NOT_SET_VALUE_MAX_VERSIONS,
  SecretSmartConfig,
} from './secretSmartConfig';

describe('getSecretSmartConfig', () => {
  const createMockSecret = (
    overrides: Partial<Secret['metadata']> = {},
  ): Secret => ({
    ...mockSecret1,
    metadata: {
      ...mockSecret1.metadata,
      ...overrides,
    },
  });

  const createMockSecretConfig = (
    overrides: Partial<SecretConfig> = {},
  ): SecretConfig => ({
    casRequired: false,
    deactivateVersionAfter: undefined,
    maxVersions: undefined,
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
    testedProperty: Exclude<keyof SecretSmartConfig, 'isCasRequiredSetOnOkms'>;
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
        testedProperty,
      }) => {
        const secret = createMockSecret(secretOverrides);
        const secretConfigOkms = createMockSecretConfig(domainOverrides);

        const result = buildSecretSmartConfig(
          secret,
          secretConfigOkms,
          mockSecretConfigReference,
        );

        expect(result[testedProperty].value).toBe(expectedValue);
        expect(result[testedProperty].origin).toBe(expectedOrigin);
        expect(result.isCasRequiredSetOnOkms).toBe(
          expectedIsCasRequiredSetOnOkms,
        );
      },
    );
  };

  describe('When secret and domain config is not set', () => {
    const testCases: TestCase[] = [
      {
        description: 'uses default maxVersion',
        secretOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        domainOverrides: { maxVersions: NOT_SET_VALUE_MAX_VERSIONS },
        expectedValue: 10,
        expectedOrigin: 'DEFAULT',
        expectedIsCasRequiredSetOnOkms: false,
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
});

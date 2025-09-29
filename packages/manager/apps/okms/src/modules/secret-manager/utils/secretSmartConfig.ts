import {
  Secret,
  SecretConfig,
  SecretConfigReference,
} from '@secret-manager/types/secret.type';

export const NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER = '0s';
export const NOT_SET_VALUE_MAX_VERSIONS = 0;
export const NOT_SET_VALUE_CAS_REQUIRED = false;

export type SecretSmartConfigOrigin = 'SECRET' | 'DOMAIN' | 'DEFAULT';

export type SecretSmartConfigValue<T> = {
  value: T;
  origin: SecretSmartConfigOrigin;
};

export type SecretSmartConfig = {
  casRequired: SecretSmartConfigValue<boolean>;
  deactivateVersionAfter: SecretSmartConfigValue<string>;
  maxVersions: SecretSmartConfigValue<number>;
  isCasRequiredSetOnOkms: boolean;
};

/**
 * Generic function to build smart config values
 * Priority: Secrets > Domains > Default
 * @param secretValue - value from secret metadata
 * @param okmsValue - value from domain metadata
 * @param notSetValue - value that indicates "not set"
 * @param defaultValue - fallback default value
 * @returns SecretSmartConfigValue with value and origin
 */
const buildSmartConfigValue = <T>(
  secretValue: T,
  okmsValue: T | undefined,
  notSetValue: T,
  defaultValue: T,
): SecretSmartConfigValue<T> => {
  if (secretValue !== notSetValue) {
    return {
      value: secretValue,
      origin: 'SECRET',
    };
  }

  if (okmsValue !== undefined && okmsValue !== notSetValue) {
    return {
      value: okmsValue,
      origin: 'DOMAIN',
    };
  }

  return {
    value: defaultValue,
    origin: 'DEFAULT',
  };
};

/**
 * buildSecretSmartConfig
 * Combine the config of the domain, the config of the secret and the reference config to get the "smart" config
 * @param secret : metadata of the secret
 * @param secretConfigOkms : metadata of the domain
 * @param secretConfigReference : reference metadata for defaults values
 * @returns
 */
export const buildSecretSmartConfig = (
  secret: Secret,
  secretConfigOkms: SecretConfig,
  secretConfigReference: SecretConfigReference,
): SecretSmartConfig => {
  return {
    casRequired: buildSmartConfigValue(
      secret.metadata.casRequired,
      secretConfigOkms.casRequired,
      NOT_SET_VALUE_CAS_REQUIRED,
      secretConfigReference.casRequired,
    ),
    deactivateVersionAfter: buildSmartConfigValue(
      secret.metadata.deactivateVersionAfter,
      secretConfigOkms.deactivateVersionAfter,
      NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
      NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
    ),
    maxVersions: buildSmartConfigValue(
      secret.metadata.maxVersions,
      secretConfigOkms.maxVersions,
      NOT_SET_VALUE_MAX_VERSIONS,
      secretConfigReference.maxVersions,
    ),
    isCasRequiredSetOnOkms:
      secretConfigOkms.casRequired !== NOT_SET_VALUE_CAS_REQUIRED,
  };
};

import {
  SecretVersion,
  SecretVersionDataField,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';

// POST version
export type CreateSecretVersionBody = SecretVersionDataField;
export type CreateSecretVersionResponse = SecretVersionWithData;

// PUT version
export type UpdateSecretVersionBody = Pick<SecretVersion, 'state'>;
export type UpdateSecretVersionResponse = SecretVersion;

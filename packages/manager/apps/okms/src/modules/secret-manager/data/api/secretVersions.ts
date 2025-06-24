import { SecretVersion } from '@secret-manager/types/secret.type';

// POST version
export type CreateSecretVersionBody = Pick<SecretVersion, 'data'>;
export type CreateSecretVersionResponse = SecretVersion;

// PUT version
export type UpdateSecretVersionBody = Pick<SecretVersion, 'state'>;
export type UpdateSecretVersionResponse = Omit<SecretVersion, 'data'>;

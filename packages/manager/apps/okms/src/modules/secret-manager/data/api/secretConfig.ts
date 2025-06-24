import { SecretConfig } from '@secret-manager/types/secret.type';

// PUT secret config
export type SecretConfigBody = Partial<SecretConfig>;
export type SecretConfigResponse = SecretConfig;

import { IAM } from '@/types/okms.type';

/**
 * SECRET
 */
export type SecretVersionState = 'ACTIVE' | 'DEACTIVATED' | 'DELETED';

// Secret data is defined as JSON, but it is typed as 'Any' in the API schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SecretData = any;

export type SecretVersionDataField = {
  data: SecretData;
};

export type SecretVersion = {
  id: number;
  state: SecretVersionState;
  createdAt: string;
  deactivatedAt?: string;
};

export type SecretVersionWithData = SecretVersion & SecretVersionDataField;

export type SecretMetadata = {
  casRequired: boolean;
  createdAt: string;
  currentVersion: number;
  customMetadata?: Record<string, string>;
  deactivateVersionAfter: string;
  maxVersions: number;
  oldestVersion: number;
  updatedAt?: string;
};

export type Secret = {
  path: string;
  version: SecretVersion;
  metadata: SecretMetadata;
  iam: IAM;
};

export type SecretWithData = Omit<Secret, 'version'> & {
  version: SecretVersionWithData;
};

export type SecretConfig = {
  casRequired: boolean;
  deactivateVersionAfter?: string;
  maxVersions?: number;
};

export type SecretConfigReference = {
  casRequired: boolean;
  maxVersions: number;
};

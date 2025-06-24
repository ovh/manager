import { IAM } from '@/types/okms.type';

/**
 * SECRET
 */
export type SecretState = 'ACTIVE' | 'DEACTIVATED' | 'DELETED';

export type SecretData = any;

export type SecretVersion = {
  createdAt: string;
  data?: SecretData;
  deactivatedAt?: string;
  id: number;
  state: SecretState;
};

export type SecretMetadata = {
  casRequired?: boolean;
  createdAt: string;
  currentVersion: number;
  customMetadata?: Record<string, string>;
  deactivateVersionAfter?: string;
  maxVersions?: number;
  oldestVersion: number;
  updatedAt?: string;
};

export type Secret = {
  path: string;
  version: SecretVersion;
  metadata: SecretMetadata;
  iam: IAM;
};

export type SecretConfig = {
  casRequired: boolean;
  deactivateVersionAfter?: string;
  maxVersions?: number;
};

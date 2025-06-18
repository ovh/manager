import { IAM } from '@/types/okms.type';

export type Secret = {
  path: string;
  version: {
    id: number;
    createdAt: string;
    deactivatedAt: string;
    state: string;
  };
  metadata: {
    casRequired: boolean;
    createdAt: string;
    updatedAt: string;
    currentVersion: number;
    customMetadata: Record<string, string>;
    deactivateVersionAfter: string;
    oldestVersion: number;
    maxVersions: number;
  };
  iam: IAM;
};

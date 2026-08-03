import { describe, expect, it } from 'vitest';

import { VaultBucket } from '@/types/Vault.type';

import { getVaultBucketEndpoint } from './vaultEndpoint';

const buildBucket = (overrides: Partial<VaultBucket> = {}): VaultBucket => ({
  id: 'bucket-id',
  name: 'bucket-name',
  performance: 'HIGH_PERF',
  region: 'eu-west-rbx',
  role: 'PRIMARY',
  status: 'READY',
  ...overrides,
});

describe('getVaultBucketEndpoint', () => {
  it('returns the endpoint published by the API when the field is there', () => {
    const bucket = buildBucket({ endPoint: 's3.published.example.net' });

    expect(getVaultBucketEndpoint(bucket)).toBe('s3.published.example.net');
  });

  it('derives the hostname from the bucket region while the field is unpublished', () => {
    const bucket = buildBucket({ endPoint: undefined, region: 'eu-west-gra' });

    expect(getVaultBucketEndpoint(bucket)).toBe('s3.eu-west-gra.io.cloud.ovh.net');
  });

  it('prefers the published endpoint over the derived one, region notwithstanding', () => {
    const bucket = buildBucket({ endPoint: 's3.other.example.net', region: 'ca-east-bhs' });

    expect(getVaultBucketEndpoint(bucket)).toBe('s3.other.example.net');
  });
});

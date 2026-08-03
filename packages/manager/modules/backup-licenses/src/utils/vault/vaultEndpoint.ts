import { VaultBucket } from '@/types/Vault.type';

/**
 * `bucket.endPoint` is absent from the published v2 schema, so the hostname is derived from the
 * region — an invented shape, isolated here so a published field replaces it in a single edit.
 */
export const getVaultBucketEndpoint = (bucket: VaultBucket): string =>
  bucket.endPoint ?? `s3.${bucket.region}.io.cloud.ovh.net`;

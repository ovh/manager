import { Bucket } from '@/types/Bucket.type';
import { VaultResource } from '@/types/Vault.type';

export const selectVaultBuckets = (vault: VaultResource): Bucket[] => vault.currentState.buckets;

export const selectVaultName = (vault: VaultResource): string => vault.currentState.name;

export const selectVaultRegion = (vault: VaultResource): string => vault.currentState.region;

import { Bucket } from '@/types/Bucket.type';
import { Resource, ResourceStatus } from '@/types/Resource.type';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';
export type VaultProductLine = 'BACKUP_AGENT' | 'BACKUP_LICENSES';
export interface Vault {
  region: string;
  secondaryRegion?: string;
  id: string;
  name: string;
  resourceName: string;
  status: ResourceStatus;
  type: VaultBillingType;
  vspcTenants: string[];
  buckets: Bucket[];
  vaultProductLine?: VaultProductLine | null;
}

export type VaultResource = Resource<Vault>;

import { Resource, ResourceStatus } from '@/types/Resource.type';

export type Performance = 'HIGHPERF' | 'STANDARD';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';
export interface Vault {
  azName: string;
  id: string;
  name: string;
  performance: Performance;
  resourceName: string;
  status: ResourceStatus;
  type: VaultBillingType;
  vspc: string[];
}

export type VaultResource = Resource<Vault>;

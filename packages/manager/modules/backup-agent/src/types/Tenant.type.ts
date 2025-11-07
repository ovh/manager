import { Bucket } from '@/types/Bucket.type';
import { ResourceStatus } from '@/types/Resource.type';

import { Vault } from './Vault.type';

export type AssociatedTenantVSPC = {
  region: string;
  id: string;
  name: string;
  status: ResourceStatus;
};

export type Tenant = {
  id: string;
  name: string;
  vaults: (Omit<Vault, 'vspcTenants' | 'buckets'> & Pick<Bucket, 'performance'>)[];
  vspcTenants: AssociatedTenantVSPC[];
};

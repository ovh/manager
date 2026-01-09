import { Bucket } from '@/types/Bucket.type';
import { ResourceStatus } from '@/types/Resource.type';
import { Vault } from '@/types/Vault.type';

export type VSPCBackupAgent = {
  id: string;
  ip: string[];
  name: string;
  type: string;
  vspcTenant: string;
  productResourceName: string;
};

export type VSPCTenant = {
  region: string;
  backupAgents: VSPCBackupAgent[];
  companyName: string;
  id: string;
  name: string;
  status: ResourceStatus;
  vaults: (Omit<Vault, 'vspcTenants' | 'buckets'> & Pick<Bucket, 'performance'>)[];
  accessUrl: string;
};

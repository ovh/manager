import { ResourceStatus, ResourceWithAzName } from '@/types/Resource.type';
import { Vault } from '@/types/Vault.type';

export type VSPCBackupAgent = {
  id: string;
  ip: string[];
  name: string;
  type: string;
  vspcTenant: string;
};

export type VSPCTenant = {
  azName: string;
  backupAgents: VSPCBackupAgent[];
  companyName: string;
  id: string;
  name: string;
  status: ResourceStatus;
  vaults: Omit<Vault, 'vspc'>[];
};

export type VSPCTenantWithAzName = VSPCTenant & Pick<ResourceWithAzName['currentState'], 'azName'>;

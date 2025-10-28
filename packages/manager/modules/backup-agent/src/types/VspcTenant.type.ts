import { ApiTask } from '@/types/ApiGeneric.type';
import { ResourceStatus } from '@/types/Resource.type';

type VSPCBackupAgent = {
  id: string;
  ip: string[];
  name: string;
  type: string;
  vspcTenant: string;
};

type VSPCTenantState = {
  azName: string;
  backupAgents: VSPCBackupAgent[];
  companyName: string;
  id: string;
  name: string;
  status: ResourceStatus;
  vaults: string[];
};

type VSPCTenantTargetSpec = {
  name: string;
};

export type VSPCTenant = {
  currentState: VSPCTenantState;
  currentTasks: ApiTask[];
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: VSPCTenantTargetSpec;
  createdAt: string;
  updatedAt: string;
};

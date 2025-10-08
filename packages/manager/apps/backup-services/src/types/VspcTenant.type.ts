import { ApiResourceStatus, ApiTask } from './ApiGeneric.type';

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
  status: ApiResourceStatus;
  vaults: string[];
};

type VSPCTenantTargetSpec = {
  name: string;
};

export type VSPCTenant = {
  currentState: VSPCTenantState;
  currentTasks: ApiTask[];
  id: string;
  resourceStatus: ApiResourceStatus;
  targetSpec: VSPCTenantTargetSpec;
  createdAt: string;
  updatedAt: string;
};

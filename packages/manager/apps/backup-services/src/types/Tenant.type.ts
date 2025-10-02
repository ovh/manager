import { ApiResourceStatus, ApiTask } from './ApiGeneric.type';

type TenantTargetSpec = {
  name: string;
};

type TenantState = {
  id: string;
  name: string;
  vaults: TenantVault[];
  vspcTenants: VSPCTenant[];
};

export type TenantVault = {
  azName: string;
  id: string;
  name: string;
  performance: 'HIGHPERF' | 'STANDARD';
  resourceName: string;
  status: ApiResourceStatus;
  type: 'BUNDLE' | 'PAYGO';
};

export type VSPCTenant = {
  azName: string;
  id: string;
  name: string;
  status: ApiResourceStatus;
};

export type Tenant = {
  currentState: TenantState;
  currentTasks: ApiTask[];
  id: string;
  resourceStatus: ApiResourceStatus;
  targetSpec: TenantTargetSpec;
  createdAt: string;
  updatedAt: string;
};

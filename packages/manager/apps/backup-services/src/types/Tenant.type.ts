import { ApiResourceStatus, ApiTask } from './ApiGeneric.type';

type AssociatedTenantVSPC = {
  azName: string;
  id: string;
  name: string;
  status: ApiResourceStatus;
};

type TenantVault = {
  azName: string;
  id: string;
  name: string;
  performance: 'HIGHPERF' | 'STANDARD';
  resourceName: string;
  status: ApiResourceStatus;
  type: 'BUNDLE' | 'PAYGO';
};

type TenantState = {
  id: string;
  name: string;
  vaults: TenantVault[];
  vspcTenants: AssociatedTenantVSPC[];
};

type TenantTargetSpec = {
  name: string;
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

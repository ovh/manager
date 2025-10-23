import { ApiTask } from '@/types/ApiGeneric.type';
import { ResourceStatus } from '@/types/Resource.type';

type AssociatedTenantVSPC = {
  azName: string;
  id: string;
  name: string;
  status: ResourceStatus;
};

type TenantVault = {
  azName: string;
  id: string;
  name: string;
  performance: 'HIGHPERF' | 'STANDARD';
  resourceName: string;
  status: ResourceStatus;
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
  resourceStatus: ResourceStatus;
  targetSpec: TenantTargetSpec;
  createdAt: string;
  updatedAt: string;
};

import { BillingType, ResourceStatus, Task } from './vcd-utility.type';

export type VCDComputeState = {
  billingType: BillingType;
  profile: string;
  name: string;
  vCPUCount: number;
  memoryQuota: number;
};

export type VCDCompute = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: VCDComputeState;
  currentTasks?: Task[];
};

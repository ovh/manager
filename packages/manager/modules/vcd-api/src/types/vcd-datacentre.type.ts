import { VCDResourceStatus, Task, WithIam } from './vcd-utility.type';

export type VCDDatacentreTargetSpec = {
  vCPUSpeed: number;
  description: string;
};

export type VCDDatacentreState = VCDDatacentreTargetSpec & {
  commercialRange: string;
  ipQuota: number;
  storageQuota: number;
  vCPUCount: number;
  region: string;
  memoryQuota: number;
  name: string;
};

export type VCDDatacentre = WithIam<{
  id: string;
  resourceStatus: VCDResourceStatus;
  currentState: VCDDatacentreState;
  targetSpec: VCDDatacentreTargetSpec;
  currentTasks?: Task[];
  updatedAt: string;
}>;

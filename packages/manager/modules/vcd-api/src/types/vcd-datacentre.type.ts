import { ResourceStatus, Task, WithIam, WithoutIam } from './vcd-utility.type';

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
  resourceStatus: ResourceStatus;
  currentState: VCDDatacentreState;
  targetSpec: VCDDatacentreTargetSpec;
  currentTasks?: Task[];
  updatedAt: string;
}>;

export type VCDDatacentreWithoutIam = WithoutIam<VCDDatacentre>;

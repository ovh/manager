import { VCDResourceStatus, Task, WithIam } from './vcd-utility.type';

export type VCDDatacentreTargetSpec = {
  vCPUSpeed: number;
  description: string;
};

export type VCDDatacentreState = VCDDatacentreTargetSpec & {
  commercialRange: 'STANDARD' | 'NSX' | 'VSAN-NSX';
  offerProfile?: 'STANDARD' | 'NSX';
  ipQuota: number;
  storageQuota: number;
  vCPUCount: number;
  region: string;
  memoryQuota: number;
  name: string;
  vrack?: string;
};

export type VCDDatacentre = WithIam<{
  id: string;
  resourceStatus: VCDResourceStatus;
  currentState: VCDDatacentreState;
  targetSpec: VCDDatacentreTargetSpec;
  currentTasks?: Task[];
  updatedAt: string;
}>;

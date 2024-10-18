export interface IVcdComputeState {
  vCPUCount: number;
  billingType: string;
  memoryQuota: number;
  name: string;
  profile: string;
}

export default interface IVcdCompute {
  id: string;
  resourceStatus: string;
  currentState: IVcdComputeState;
  currentTasks?: any[];
}

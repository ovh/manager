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

export interface IVcdOrderableComputeState extends IVcdComputeState {
  vCPUSpeed: number;
}

export interface IVcdOrderableCompute
  extends Omit<IVcdCompute, 'currentState'> {
  currentState: IVcdOrderableComputeState;
}

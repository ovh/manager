import { BillingType, Task, VCDResourceStatus } from './vcd-utility.type';

export type VCDStorageState = {
  billingType: BillingType;
  profile: string;
  name: string;
  capacity: number;
  type: string;
};

export type VCDStorage = {
  id: string;
  resourceStatus: VCDResourceStatus;
  currentState: VCDStorageState;
  currentTasks?: Task[];
};

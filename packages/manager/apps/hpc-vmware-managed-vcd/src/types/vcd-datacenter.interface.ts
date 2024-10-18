import { IamObject } from '@ovh-ux/manager-react-components';

export interface IVcdDatacentreState {
  vCPUSpeed: number;
  description: string;
}

export interface IVcdDatacentreCurrentState extends IVcdDatacentreState {
  commercialRange: string;
  ipQuota: number;
  storageQuota: number;
  vCPUCount: number;
  region: string;
  memoryQuota: number;
  name: string;
}

export default interface IVcdDatacentre {
  id: string;
  resourceStatus: string;
  currentState: IVcdDatacentreCurrentState;
  targetSpec: IVcdDatacentreState;
  currentTasks?: any[];
  iam: IamObject;
  updatedAt: string;
}

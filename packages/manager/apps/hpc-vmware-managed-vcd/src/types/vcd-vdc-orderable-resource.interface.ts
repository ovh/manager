import { IVcdComputeState } from './vcd-compute.interface';
import { IVcdStorageState } from './vcd-storage.interface';

export interface IVdcOrderableVHost
  extends Omit<IVcdComputeState, 'billingType'> {
  vCPUSpeed: number;
}

export type IVdcOrderableStorage = Omit<IVcdStorageState, 'billingType'>;

export interface IVdcOrderableResource {
  compute: IVdcOrderableVHost[];
  storage: IVdcOrderableStorage[];
}

import { IVcdCatalogProductPricing } from './vcd-catalog.interface';
import { IVcdComputeState } from './vcd-compute.interface';
import { IVcdStorageState } from './vcd-storage.interface';

export interface IVdcOrderableVHost
  extends Omit<IVcdComputeState, 'billingType'> {
  vCPUSpeed: number;
}
export interface IVdcOrderableVhostPriced extends IVdcOrderableVHost {
  prices: IVcdCatalogProductPricing[];
}

export type IVdcOrderableStorage = Omit<IVcdStorageState, 'billingType'>;

export interface IVdcOrderableResource {
  compute: IVdcOrderableVHost[];
  storage: IVdcOrderableStorage[];
}

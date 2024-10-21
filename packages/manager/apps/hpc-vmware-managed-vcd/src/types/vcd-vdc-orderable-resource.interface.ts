import { IVcdCatalogProductPricing } from './vcd-catalog.interface';
import { IVcdComputeState } from './vcd-compute.interface';
import { IVcdStorageState } from './vcd-storage.interface';

export interface IVdcOrderableVHost
  extends Omit<IVcdComputeState, 'billingType'> {
  vCPUSpeed: number;
}
export interface IVdcOrderableVhostPriced extends IVdcOrderableVHost {
  pricing: IVcdCatalogProductPricing;
}

export type IVdcOrderableStorage = Omit<IVcdStorageState, 'billingType'>;
export interface IVdcOrderableStoragePriced extends IVdcOrderableStorage {
  pricing: IVcdCatalogProductPricing;
}

export type IVdcOrderableResource = IVdcOrderableVHost | IVdcOrderableStorage;
export type IVdcOrderableResourcePriced =
  | IVdcOrderableVhostPriced
  | IVdcOrderableStoragePriced;

export interface IVdcOrderableResourceData {
  compute: IVdcOrderableVHost[];
  storage: IVdcOrderableStorage[];
}

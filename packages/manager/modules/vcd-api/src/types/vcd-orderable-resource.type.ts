import { VCDComputeState } from './vcd-compute.type';
import { VCDStorageState } from './vcd-storage.type';
import { VCDCatalogProductPricing } from './vcd-catalog.type';

export type VCDOrderableVHost = Omit<VCDComputeState, 'billingType'> & {
  vCPUSpeed: number;
};
export type VCDOrderableStorage = Omit<VCDStorageState, 'billingType'>;

type WithPricing<T> = T & { pricing: VCDCatalogProductPricing };

export type VCDOrderableVhostPriced = WithPricing<VCDOrderableVHost>;
export type VCDOrderableStoragePriced = WithPricing<VCDOrderableStorage>;

export type VCDOrderableResource = VCDOrderableVHost | VCDOrderableStorage;
export type VCDOrderableResourcePriced =
  | VCDOrderableVhostPriced
  | VCDOrderableStoragePriced;

export type VCDOrderableResourceData = {
  compute: VCDOrderableVHost[];
  storage: VCDOrderableStorage[];
};

import { RegionalizedResource } from '@/types/cloud/billingView/RegionalizedResource';

/** TypedResources */
export interface TypedResources {
  /** Resources per region */
  resources?: RegionalizedResource[];
  /** Total price */
  totalPrice?: number;
  /** Type of the resources */
  type?: string;
}

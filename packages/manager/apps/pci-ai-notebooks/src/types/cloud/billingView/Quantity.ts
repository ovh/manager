import { UnitQuantityEnum } from '@/types/cloud/billingView/UnitQuantityEnum';

/** Quantity */
export interface Quantity {
  /** Quantity unit */
  unit?: UnitQuantityEnum;
  /** Quantity value */
  value?: number;
}

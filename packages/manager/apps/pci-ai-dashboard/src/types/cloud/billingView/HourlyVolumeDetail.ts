import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyVolumeDetail */
export interface HourlyVolumeDetail {
  /** GiBh of volume */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
  /** Volume ID */
  volumeId?: string;
}

import { HourlyVolumeDetail } from '@/types/cloud/billingView/HourlyVolumeDetail';
import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyVolume */
export interface HourlyVolume {
  /** Detail about volume consumption */
  details?: HourlyVolumeDetail[];
  /** Total GiBh of volume */
  quantity?: Quantity;
  /** Region */
  region?: string;
  /** Total price */
  totalPrice?: number;
  /** Volume type */
  type?: string;
}

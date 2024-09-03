import { InstanceSnapshot } from '@/types/cloud/billingView/InstanceSnapshot';
import { VolumeSnapshot } from '@/types/cloud/billingView/VolumeSnapshot';

/** HourlySnapshot */
export interface HourlySnapshot {
  /** Instance snapshot details */
  instance?: InstanceSnapshot;
  /** Region */
  region?: string;
  /** Total price */
  totalPrice?: number;
  /** Volume snapshot details */
  volume?: VolumeSnapshot;
}

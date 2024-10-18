import { BandwidthInstance } from '@/types/cloud/billingView/BandwidthInstance';

/** HourlyInstanceBandwidth */
export interface HourlyInstanceBandwidth {
  /** Instance incoming bandwidth details */
  incomingBandwidth?: BandwidthInstance;
  /** Instance outgoing bandwidth details */
  outgoingBandwidth?: BandwidthInstance;
  /** Region */
  region?: string;
  /** Total price */
  totalPrice?: number;
}

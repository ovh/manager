import { BandwidthStorage } from '@/types/cloud/billingView/BandwidthStorage';
import { StoredStorage } from '@/types/cloud/billingView/StoredStorage';
import { StorageTypeEnum } from '@/types/cloud/billingView/StorageTypeEnum';

/** HourlyStorage */
export interface HourlyStorage {
  /** Bucket Name */
  bucketName?: string;
  /** Storage incoming bandwidth details */
  incomingBandwidth?: BandwidthStorage;
  /** Storage incoming internal bandwidth details */
  incomingInternalBandwidth?: BandwidthStorage;
  /** Storage outgoing bandwidth details */
  outgoingBandwidth?: BandwidthStorage;
  /** Storage outgoing internal bandwidth details */
  outgoingInternalBandwidth?: BandwidthStorage;
  /** Region */
  region?: string;
  /** Information about stored data */
  stored?: StoredStorage;
  /** Total price */
  totalPrice?: number;
  /** Storage type */
  type?: StorageTypeEnum;
}

import { HourlyInstance } from '@/types/cloud/billingView/HourlyInstance';
import { HourlyInstanceBandwidth } from '@/types/cloud/billingView/HourlyInstanceBandwidth';
import { HourlyInstanceOption } from '@/types/cloud/billingView/HourlyInstanceOption';
import { HourlySnapshot } from '@/types/cloud/billingView/HourlySnapshot';
import { HourlyStorage } from '@/types/cloud/billingView/HourlyStorage';
import { HourlyVolume } from '@/types/cloud/billingView/HourlyVolume';

/** HourlyResources */
export interface HourlyResources {
  /** Details about hourly instances */
  instance?: HourlyInstance[];
  /** Details about instances bandwidth consumption */
  instanceBandwidth?: HourlyInstanceBandwidth[];
  /** Details about hourly instances options */
  instanceOption?: HourlyInstanceOption[];
  /** Details about hourly snapshots */
  snapshot?: HourlySnapshot[];
  /** Details about hourly storage */
  storage?: HourlyStorage[];
  /** Details about hourly volumes */
  volume?: HourlyVolume[];
}

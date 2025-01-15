import { TVolumeAddon, TVolumePricing } from '@/api/data/catalog';
import { TRegion } from '@/api/data/regions';

export type TFormState = {
  region: TRegion;
  volumeType: TVolumeAddon;
  pricing: TVolumePricing;
  volumeName: string;
  volumeCapacity: number;
  availabilityZone: string;
};

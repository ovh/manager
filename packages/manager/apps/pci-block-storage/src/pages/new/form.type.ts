import { TLocalisation } from '@/api/hooks/useRegions';
import { TVolumeAddon } from '@/api/data/catalog';

export type TFormState = {
  region: TLocalisation;
  volumeType: TVolumeAddon;
  volumeName: string;
  volumeCapacity: number;
  availabilityZone: string;
};

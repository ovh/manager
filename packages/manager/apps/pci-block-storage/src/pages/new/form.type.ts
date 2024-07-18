import { TAddon } from '@/api/data/catalog';
import { TLocalisation } from '@/api/hooks/useRegions';

export type TFormState = {
  region: TLocalisation;
  volumeType: TAddon;
  volumeName: string;
  volumeCapacity: number;
};

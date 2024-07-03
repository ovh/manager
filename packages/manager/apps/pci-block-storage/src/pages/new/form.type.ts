import { StepsEnum } from '@/pages/new/steps.enum';
import { TAddon } from '@/api/data/catalog';
import { TLocalisation } from '@/api/hooks/useRegions';

export type TFormState = {
  step: StepsEnum;
  region: TLocalisation;
  volumeType: TAddon;
  volumeName: string;
  volumeCapacity: number;
};

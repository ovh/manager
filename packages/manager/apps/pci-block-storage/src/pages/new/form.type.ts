import { TAddon } from '@ovh-ux/manager-pci-common';
import { TLocalisation } from '@/api/hooks/useRegions';

export type TFormState = {
  region: TLocalisation;
  volumeType: TAddon;
  volumeName: string;
  volumeCapacity: number;
};

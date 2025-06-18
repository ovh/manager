import { TRegion } from '@/api/data/regions';
import { EncryptionType } from '@/api/select/volume';

export type TFormState = {
  region: TRegion;
  volumeType: string;
  encryptionType: EncryptionType | null;
  volumeName: string;
  volumeCapacity: number;
  availabilityZone: string;
};

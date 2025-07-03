import { TRegion } from '@/api/data/regions';
import { EncryptionType } from '@/api/select/volume';
import { TVolumeModel } from '@/api/hooks/useCatalog';

export type TFormState = {
  region: TRegion;
  volumeType: TVolumeModel['name'];
  encryptionType: EncryptionType | null;
  volumeName: string;
  volumeCapacity: number;
  availabilityZone: string;
};

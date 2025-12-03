import { TRegion } from '@/api/data/regions';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { EncryptionType } from '@/api/select/volume';

export type TFormState = {
  region: TRegion;
  volumeType: TVolumeModel['name'];
  encryptionType: EncryptionType | null;
  volumeName: string;
  volumeCapacity: number;
  availabilityZone: string;
};

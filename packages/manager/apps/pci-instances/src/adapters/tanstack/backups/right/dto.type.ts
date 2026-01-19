import { TImageOsType } from '@/adapters/tanstack/instancesCatalog/right/dto.type';

export type TBackupDTO = {
  id: string;
  name: string;
  type: TImageOsType;
  minDisk: number;
  minRam: number;
  region: string;
  size: number;
  creationDate: string;
};

import { TOsType } from './common.types';

export type TBackup = {
  id: string;
  name: string;
  type: TOsType;
  size: number;
  minDisk: number;
  minRam: number;
  region: string;
  creationDate: string;
};

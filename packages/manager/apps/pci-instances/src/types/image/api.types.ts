import { DeepReadonly } from '../utils.type';

export type TImageDto = DeepReadonly<{
  creationDate: string;
  flavorType: string | null;
  id: string;
  minDisk: number;
  minRam: number;
  name: string;
  planCode: string;
  region: string;
  size: number;
  status: string;
  user: string;
  visibility: string;
}>;

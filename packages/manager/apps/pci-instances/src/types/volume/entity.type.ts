import { TAnyZone, TStatus } from './common.type';

export type TVolume = {
  id: string;
  name: string;
  size: number;
  attachedInstances: string[];
  availabilityZone: string | null | TAnyZone;
  status: TStatus;
};

import { TStatus, TAnyZone } from './common.type';

type TAttachedInstance = {
  id: string;
};

export type TVolumeDto = {
  id: string;
  name: string;
  size: number;
  availabilityZone: string | null | TAnyZone;
  attachedTo: TAttachedInstance[];
  status: TStatus;
};

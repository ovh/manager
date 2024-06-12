import { IamMetadata } from '../api.type';

export type Vrack = {
  name: string;
  description: string;
};

export type VrackWithIAM = Vrack & IamMetadata;

export type VrackTask = {
  function: string;
  id: number;
  lastUpdate: Date;
  orderId?: number;
  serviceName: string;
  status: string;
  targetDomain?: string;
  todoDate: Date;
};

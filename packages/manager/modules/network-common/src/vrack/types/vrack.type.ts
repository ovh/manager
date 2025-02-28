import { AllowedService, IamMetadata } from '../types/api.type';

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

export type GetVrackAllowedServicesParams = {
  /** Filter on a specific service family */
  serviceFamily: AllowedService;
  /** The internal name of your vrack */
  vrack: string;
};

export type AssociateVrackServicesParams = {
  /** The internal name of your vrack */
  vrack: string;
  /** vrackServices service name */
  vrackServices: string;
};

import { TDeploymentMode } from '@/types/instance/common.type';

export type TFlavorForTable = {
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  memory: number;
  vcore: number;
  storage: string;
  mode: TDeploymentMode;
  priceHour: number;
  priceMonth: number;
};

export type TFlavorDataForCart = {
  name: string;
  memory: number;
  vcore: number;
};

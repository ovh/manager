import { TDeploymentMode } from '@/types/instance/common.type';

export type TFlavorDataForTable = {
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  memory: number;
  vCore: number;
  storage: string;
  mode: TDeploymentMode;
  hourlyPrice: number;
  monthlyPrice: number;
};

export type TFlavorDataForCart = {
  name: string;
  memory: number;
  vCore: number;
};

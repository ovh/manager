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

export type TGpuFlavorDataForTable = {
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  gpu: string;
  numberOfGpu: number;
  vRamTotal: number;
  memory: number;
  vCore: number;
  storage: string;
  hourlyPrice: number;
  monthlyPrice: number;
};

import { TDeploymentMode } from '@/types/instance/common.type';

export type TFlavorData = {
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  memory: number;
  vCore: number;
  storage: string;
  bandwidthPublic: string;
  bandwidthPrivate: string;
  mode: TDeploymentMode;
  hourlyPrice: number;
  monthlyPrice: number;
};

export type TFlavorDataForTable = Omit<
  TFlavorData,
  'bandwidthPublic' | 'bandwidthPrivate'
>;

export type TGpuFlavorData = {
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  gpu: string;
  numberOfGpu: number;
  vRamTotal: number;
  memory: number;
  vCore: number;
  storage: string;
  bandwidthPublic: string;
  bandwidthPrivate: string;
  hourlyPrice: number;
  monthlyPrice: number;
};

export type TGpuFlavorDataForTable = Omit<
  TGpuFlavorData,
  'bandwidthPublic' | 'bandwidthPrivate'
>;

export type TFlavorDataForCart = {
  name: string;
  memory: number;
  gpu?: string;
  numberOfGpu?: number;
  vCore: number;
  vRamTotal?: number;
  storage: string;
  bandwidthPublic: string;
  bandwidthPrivate: string;
};

export const mapFlavorToTable = (flavor: TFlavorData): TFlavorDataForTable => ({
  unavailable: flavor.unavailable,
  unavailableQuota: flavor.unavailableQuota,
  name: flavor.name,
  memory: flavor.memory,
  vCore: flavor.vCore,
  storage: flavor.storage,
  mode: flavor.mode,
  hourlyPrice: flavor.hourlyPrice,
  monthlyPrice: flavor.monthlyPrice,
});

export const mapGpuFlavorToTable = (
  gpuFlavor: TGpuFlavorData,
): TGpuFlavorDataForTable => ({
  unavailable: gpuFlavor.unavailable,
  unavailableQuota: gpuFlavor.unavailableQuota,
  name: gpuFlavor.name,
  gpu: gpuFlavor.gpu,
  numberOfGpu: gpuFlavor.numberOfGpu,
  vRamTotal: gpuFlavor.vRamTotal,
  memory: gpuFlavor.memory,
  vCore: gpuFlavor.vCore,
  storage: gpuFlavor.storage,
  hourlyPrice: gpuFlavor.hourlyPrice,
  monthlyPrice: gpuFlavor.monthlyPrice,
});

export const mapFlavorToCart = (
  flavor: TFlavorData | TGpuFlavorData,
): TFlavorDataForCart => ({
  name: flavor.name,
  memory: flavor.memory,
  vCore: flavor.vCore,
  storage: flavor.storage,
  bandwidthPublic: flavor.bandwidthPublic,
  bandwidthPrivate: flavor.bandwidthPrivate,
  gpu: 'gpu' in flavor ? flavor.gpu : undefined,
  numberOfGpu: 'numberOfGpu' in flavor ? flavor.numberOfGpu : undefined,
  vRamTotal: 'vRamTotal' in flavor ? flavor.vRamTotal : undefined,
});

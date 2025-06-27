import { TRegionType } from '@ovh-ux/manager-pci-common';
import { TRegionType } from '@ovh-ux/manager-pci-common';
import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePrice,
  TInstancePrice,
  TStatus,
} from './common.type';
import { TBaseAction } from './action/action.type';

export type TInstanceAddressType = TAddressType;

export type TInstanceStatusSeverity = 'success' | 'error' | 'warning' | 'info';
export type TInstanceStatusState = TStatus;

export type TInstanceActionName = TActionName;

export type TInstanceStatus = {
  label: TInstanceStatusState;
  severity: TInstanceStatusSeverity;
};

export type TAddress = {
  ip: string;
  version: number;
  gatewayIp?: string;
};

export type TVolume = {
  id: string;
  name: string;
};

export type TInstanceAction = {
  label: string;
  link: {
    path: string;
    isExternal: boolean;
  };
};

export type TInstanceActions = Map<TInstanceActionGroup, TInstanceAction[]>;

export type TInstance = DeepReadonly<{
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  status: TInstanceStatus;
  region: string;
  imageId: string;
  imageName: string;
  addresses: Map<TInstanceAddressType, TAddress[]>;
  volumes: TVolume[];
  actions: TInstanceActions;
  pendingTask: boolean;
  availabilityZone: string | null;
  taskState: string | null;
  isImageDeprecated: boolean;
  isEditionEnabled: boolean;
}>;

export type TNetwork = TAddress & {
  id: string;
  name: string;
  actions: TBaseAction[];
  flag?: string;
};

export type TInstanceDetail = DeepReadonly<{
  id: string;
  name: string;
  flavorName: string;
  flavorRam: string;
  flavorCpu: string;
  storage: string;
  publicBandwidth: string;
  status: TInstanceStatus;
  region: string;
  regionType: TRegionType;
  imageName: string;
  networks: Map<TInstanceAddressType, TNetwork[]>;
  volumes: TVolume[];
  pendingTask: boolean;
  availabilityZone: string | null;
  prices: TInstancePrice[];
  taskState: string | null;
  sshKey: string;
  sshLogin: string;
  isEditionEnabled: boolean;
}>;

export type TInstanceDetailContextType = {
  data: TInstanceDetail;
  isLoading: boolean;
};

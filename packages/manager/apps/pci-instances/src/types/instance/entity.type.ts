import { TRegionType } from '@ovh-ux/manager-pci-common';
import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePrice,
  TStatus,
} from './common.type';

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
  gatewayIp: string;
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

export type TInstanceDetail = DeepReadonly<{
  id: string;
  name: string;
  flavorName: string;
  flavorRam: string;
  flavorCpu: string;
  status: TInstanceStatus;
  region: string;
  regionType: TRegionType;
  pendingTask: boolean;
  availabilityZone: string | null;
  actions: TInstanceActions;
  prices: TInstancePrice[];
  taskState: string | null;
  isEditionEnabled: boolean;
  standaloneActions: TInstanceActionName[];
}>;

export type TInstanceDetailContextType = {
  data: TInstanceDetail;
  isLoading: boolean;
};

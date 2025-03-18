import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TStatus,
} from './common.type';

export type TInstanceAddressType = TAddressType;

export type TInstanceStatusSeverity = 'success' | 'error' | 'warning' | 'info';
export type TInstanceStatusState = TStatus;

export type TInstanceActionName = TActionName;

export type TInstanceStatus = {
  state: TInstanceStatusState;
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
}>;

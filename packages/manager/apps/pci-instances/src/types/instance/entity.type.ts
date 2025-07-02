import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePrice,
  TStatus,
  TRegionType,
  TSubnet,
  TFlavorSpec,
  TImage,
  TBackup,
} from './common.type';

export type TInstanceAddressType = TAddressType;

export type TInstanceStatusSeverity = 'success' | 'error' | 'warning' | 'info';
export type TInstanceStatusState = TStatus;

export type TInstanceActionName = TActionName;

export type TInstanceStatus = {
  label: TInstanceStatusState;
  severity: TInstanceStatusSeverity;
};

export type TAggregatedInstanceAddress = {
  ip: string;
  version: number;
  gatewayIp: string;
};

type TAggregatedInstanceVolume = {
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

export type TAggregatedInstanceActions = Map<
  TInstanceActionGroup,
  TInstanceAction[]
>;

export type TAggregatedInstance = DeepReadonly<{
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  status: TInstanceStatus;
  region: string;
  imageId: string;
  imageName: string;
  addresses: Map<TInstanceAddressType, TAggregatedInstanceAddress[]>;
  volumes: TAggregatedInstanceVolume[];
  actions: TAggregatedInstanceActions;
  pendingTask: boolean;
  availabilityZone: string | null;
  taskState: string | null;
  isImageDeprecated: boolean;
}>;

/**
 *
 *
 *
 *
 *
 * REFACTOR
 */

export type TVolume = {
  id: string;
  name: string | null;
  size: number | null;
};

export type TAddress = {
  ip: string;
  version: number;
  subnet: TSubnet | null;
};

export type TRegion = {
  name: string;
  type: TRegionType;
  availabilityZone: string | null;
};

export type TInstanceState = TInstanceStatus & {
  pendingTask: boolean;
  taskState: string | null;
};

type TAction = {
  name: TActionName;
  group: TInstanceActionGroup;
};

type TFlavor = {
  id: string;
  name: string;
  specs: {
    vcores: TFlavorSpec;
    ram: TFlavorSpec;
    storage: TFlavorSpec;
    bandwidth: {
      public: TFlavorSpec;
      private: TFlavorSpec;
    };
  } | null;
};

export type TInstance = {
  id: string;
  name: string;
  region: TRegion;
  status: TInstanceState;
  actions: TAction[];
  addresses: Map<TInstanceAddressType, TAddress[]>;
  volumes: TVolume[];
  flavor: TFlavor;
  pricings: TInstancePrice[] | null;
  image: TImage | null;
  backups: TBackup | null;
  sshKey: string | null;
  login: string | null;
};

import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePriceType,
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
  addresses: Map<TInstanceAddressType, TAddress[]>;
  volumes: TVolume[];
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

export type TVolume2 = {
  id: string;
  name: string | null;
  size: number | null;
};

export type TAddress2 = {
  ip: string;
  version: number;
  subnet: {
    id: string;
    name: string;
    gatewayIP: string;
    network: {
      id: string;
      name: string;
    };
  } | null;
};

export type TInstance = {
  id: string;
  name: string;
  region: {
    name: string;
    type: 'region' | 'localzone' | 'region-3-az';
    availabilityZone: string | null;
  };
  state: {
    status: TInstanceStatus;
    pendingTask: boolean;
    taskState: string | null;
  };
  actions: {
    name: TActionName;
    group: TInstanceActionGroup;
  }[];
  addresses: Map<TInstanceAddressType, TAddress2[]>;
  volumes: TVolume2[];
  flavor: {
    id: string;
    name: string;
    specs: {
      vcores: {
        value: number;
        unit: string;
      };
      ram: {
        value: number;
        unit: string;
      };
      storage: {
        value: number;
        unit: string;
      };
      bandwidth: {
        public: {
          value: number;
          unit: string;
        };
        private: {
          value: number;
          unit: string;
        };
      };
    } | null;
  };
  pricings:
    | {
        type: TInstancePriceType;
        value: number;
        status: 'enabled' | 'available' | 'eligible';
      }[]
    | null;
  image: {
    id: string;
    name: string;
    deprecated: boolean;
  } | null;
  backups: {
    count: number;
    lastBackup: string;
  } | null;
  sshKey: string | null;
  login: string | null;
};

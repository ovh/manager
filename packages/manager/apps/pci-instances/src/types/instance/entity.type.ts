import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TPrice,
  TStatus,
  TRegionType,
  TSubnet,
  TFlavorSpec,
  TImage,
  TBackup,
  TStatusSeverity,
  TSeverity,
} from './common.type';

export type TInstanceAddressType = TAddressType;

export type TInstanceStatusSeverity = TSeverity;
export type TInstanceStatus = TStatus;

export type TInstanceActionName = TActionName;

export type TAggregatedInstanceStatus = TStatusSeverity;

export type TInstanceTaskStatus = {
  isPending: boolean;
  status: string | null;
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

export type TAggregatedInstanceAction = {
  label: string;
  link: {
    path: string;
    isExternal: boolean;
  };
};

export type TAggregatedInstanceActions = Map<
  TInstanceActionGroup,
  TAggregatedInstanceAction[]
>;

export type TAggregatedInstance = DeepReadonly<{
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  status: TAggregatedInstanceStatus;
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
  creationDate: Date | null;
}>;

export type TInstanceVolume = {
  id: string;
  name: string | null;
  size: number | null;
};

type TInstanceSubnet = TSubnet;

export type TInstanceAddress = {
  ip: string;
  version: number;
  subnet: TInstanceSubnet | null;
};

type TInstanceRegionType = TRegionType;

export type TInstanceRegion = {
  name: string;
  type: TInstanceRegionType;
  availabilityZone: string | null;
};

export type TInstanceAction = {
  name: TInstanceActionName;
  group: TInstanceActionGroup;
};

type TInstanceFlavorSpec = TFlavorSpec;

export type TInstanceFlavor = {
  id: string;
  name: string;
  specs: {
    cpu: TInstanceFlavorSpec;
    ram: TInstanceFlavorSpec;
    storage: TInstanceFlavorSpec;
    bandwidth: {
      public: TInstanceFlavorSpec;
      private: TInstanceFlavorSpec;
    };
  } | null;
};

export type TInstancePrice = TPrice;

export type TInstanceImage = TImage;

type TInstanceBackup = TBackup;

export type TInstanceAddresses = Map<TInstanceAddressType, TInstanceAddress[]>;

export type TInstance = {
  id: string;
  name: string;
  region: TInstanceRegion;
  status: TInstanceStatus;
  task: TInstanceTaskStatus;
  actions: TInstanceAction[];
  addresses: TInstanceAddresses;
  volumes: TInstanceVolume[] | null;
  flavor: TInstanceFlavor | null;
  pricings: TInstancePrice[] | null;
  image: TInstanceImage | null;
  backups: TInstanceBackup[] | null;
  sshKey: string | null;
  login: string | null;
};

export type TPartialInstance = Pick<TInstance, 'id'> & Partial<TInstance>;

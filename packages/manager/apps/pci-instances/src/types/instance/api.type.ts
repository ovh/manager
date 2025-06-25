import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePriceType,
  TStatus,
} from './common.type';

export type TInstanceAddressTypeDto = TAddressType;

export type TInstanceAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  gatewayIp: string;
};

export type TInstanceVolumeDto = {
  id: string;
  name: string;
};

export type TInstanceActionDto = {
  name: TInstanceActionNameDto;
  group: TInstanceActionGroup;
};

export type TInstanceActionNameDto = TActionName;
export type TInstanceStatusDto = TStatus;

export type TInstanceDto = {
  addresses: TInstanceAddressDto[];
  flavorId: string;
  flavorName: string;
  id: string;
  imageId: string;
  imageName: string;
  name: string;
  region: string;
  status: TInstanceStatusDto;
  volumes: TInstanceVolumeDto[];
  actions: TInstanceActionDto[];
  pendingTask: boolean;
  availabilityZone: string | null;
  taskState: string;
  isImageDeprecated: boolean;
};

export type TPartialInstanceDto = Pick<TInstanceDto, 'id'> &
  Partial<TInstanceDto>;

export type TRetrieveInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: string;
  searchValue?: string;
}>;

/**
 *
 *
 *
 * REWORK
 *
 *
 *
 *
 */

type TSubnetDto = {
  id: string;
  name: string;
  gatewayIP: string;
  network: {
    id: string;
    name: string;
  };
};

type TAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  subnet?: TSubnetDto;
};

type TRegionType = 'region' | 'localzone' | 'region-3-az';

export type TVolumeDto = {
  id: string;
  name?: string;
  size?: number;
};

type TFlavorSpecDto = {
  value: number;
  unit: string;
};

export type TFlavorDto = {
  id: string;
  name: string;
  specs: {
    vcores: TFlavorSpecDto;
    ram: TFlavorSpecDto;
    storage: TFlavorSpecDto;
    bandwidth: {
      public: TFlavorSpecDto;
      private: TFlavorSpecDto;
    };
  };
};

type TPriceTypeDto = TInstancePriceType;

type TInstancePriceDto = {
  type: TPriceTypeDto;
  value: number;
  status: 'enabled' | 'available' | 'eligible';
};

type TImageDto = {
  id: string;
  name: string;
  deprecated: boolean;
};

type TBackupDto = {
  count: number;
  lastBackup: string;
};

export type TInstanceDto2 = {
  id: string;
  name: string;
  region: string;
  regionType: TRegionType;
  availabilityZone: string | null;
  pendingTask: boolean;
  taskState: string;
  sshKey: string;
  login: string;
  addresses: TAddressDto[];
  status: TInstanceStatusDto;
  actions: TInstanceActionDto[];
  volumes: TVolumeDto[];
  flavor: TFlavorDto;
  pricings: TInstancePriceDto[];
  image?: TImageDto;
  backups?: TBackupDto;
};

import { TRegionType } from '@ovh-ux/manager-pci-common';
import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TInstancePrice,
  TStatus,
} from './common.type';

export type TInstanceAddressTypeDto = TAddressType;

export type TSubnetDto = {
  id: string;
  name: string;
  gatewayIp: string;
  network: {
    id: string;
    name: string;
  };
};

export type TInstanceNetworkAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  subnet: TSubnetDto;
};

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

export type TFlavorDto = {
  id: string;
  name: string;
  specs: {
    cpu: number;
    ram: number;
    storage: number;
    bandwidth: {
      public: number;
      private: number;
    };
  };
};

export type TImageDto = {
  id: string;
  name: string;
  deprecated: boolean;
};

export type TPriceDto = TInstancePrice;

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

export type TInstanceDetailDto = {
  addresses: TInstanceNetworkAddressDto[];
  flavor: TFlavorDto;
  id: string;
  image: TImageDto;
  name: string;
  region: string;
  regionType: TRegionType;
  status: TInstanceStatusDto;
  volumes: TInstanceVolumeDto[];
  actions: TInstanceActionDto[];
  pendingTask: boolean;
  prices: TPriceDto[];
  availabilityZone: string | null;
  taskState: string;
  isImageDeprecated: boolean;
  sshKey: string;
  login: string;
};

import { TRegionType } from '@ovh-ux/manager-pci-common';
import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TStatus,
} from './common.type';

export type TInstanceAddressTypeDto = TAddressType;

export type TInstanceNetworkDto = {
  id: string;
  name: string;
  gatewayIp: string;
};

export type TInstanceAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  network?: TInstanceNetworkDto;
};

export type TInstanceVolumeDto = {
  id: string;
  name: string;
  size: string;
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

export type TPriceDto = {
  type: 'hour' | 'month' | 'licence' | 'savingplans';
  value: number;
  status: 'enabled' | 'available' | 'eligible';
};

export type TInstanceActionNameDto = TActionName;
export type TInstanceStatusDto = TStatus;
export type TInstanceRegionTypeDto = TRegionType;

export type TInstanceDto = {
  addresses: TInstanceAddressDto[];
  flavor: TFlavorDto;
  flavorId: string;
  flavorName: string;
  id: string;
  image: TImageDto;
  imageId: string;
  imageName: string;
  name: string;
  region: string;
  regionType: TInstanceRegionTypeDto;
  status: TInstanceStatusDto;
  volumes: TInstanceVolumeDto[];
  actions: TInstanceActionDto[];
  pendingTask: boolean;
  prices: TPriceDto[];
  availabilityZone: string | null;
  sshKey: string;
  login: string;
  taskState: string;
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

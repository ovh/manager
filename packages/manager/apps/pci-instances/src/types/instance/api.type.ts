import { TRegionType } from '@ovh-ux/manager-pci-common';
import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TStatus,
  TInstancePriceType,
} from './common.type';

export type TInstanceAddressTypeDto = TAddressType;

export type TBaseInstanceAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
};

export type TSubnetDto = {
  id: string;
  name: string;
  gatewayIp: string;
  network: {
    id: string;
    name: string;
  };
};

export type TInstanceDetailAddressDto = TBaseInstanceAddressDto & {
  subnet: TSubnetDto;
};

export type TInstanceAddressDto = TBaseInstanceAddressDto & {
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

export type TFlavorSpecDto = {
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

export type TInstancePriceTypeDto = TInstancePriceType;

export type TInstancePriceDto = {
  type: TInstancePriceTypeDto;
  value: number;
  status: 'enabled' | 'available' | 'eligible';
};

export type TBaseInstanceDto = {
  id: string;
  name: string;
  status: TInstanceStatusDto;
  addresses: TBaseInstanceAddressDto[];
  volumes: TInstanceVolumeDto[];
  region: string;
  availabilityZone: string | null;
  regionType: TRegionType;
  actions: TInstanceActionDto[];
  pendingTask: boolean;
  taskState: string;
  flavor: TFlavorDto;
  pricings: TInstancePriceDto[];
  sshKey: string;
};

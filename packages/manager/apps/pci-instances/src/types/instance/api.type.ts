import { DeepReadonly } from '../utils.type';
import { TActionName, TAddressType, TStatus } from './common.type';

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
  enabled: boolean;
};

export type TInstanceActionNameDto = TActionName;
export type TInstanceStatusDto = TStatus;

export type TInstanceDto = DeepReadonly<{
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
}>;

export type TRetrieveInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: string;
  searchValue?: string;
}>;

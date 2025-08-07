import { DeepReadonly } from '../utils.type';
import {
  TActionName,
  TAddressType,
  TInstanceActionGroup,
  TStatus,
  TRegionType,
  TSubnet,
  TFlavorSpec,
  TImage,
  TBackup,
} from './common.type';

export type TInstanceAddressTypeDto = TAddressType;

type TAggregatedInstanceAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  gatewayIp: string;
};

export type TAggregatedInstanceVolumeDto = {
  id: string;
  name: string;
};

type TInstanceActionNameDto = TActionName;
type TInstanceActionGroupDto = TInstanceActionGroup;

export type TInstanceActionDto = {
  name: TInstanceActionNameDto;
  group: TInstanceActionGroupDto;
};

export type TInstanceStatusDto = TStatus;

export type TAggregatedInstanceDto = {
  addresses: TAggregatedInstanceAddressDto[];
  flavorId: string;
  flavorName: string;
  id: string;
  imageId: string;
  imageName: string;
  name: string;
  region: string;
  status: TInstanceStatusDto;
  volumes: TAggregatedInstanceVolumeDto[];
  actions: TInstanceActionDto[];
  pendingTask: boolean;
  availabilityZone: string | null;
  taskState: string;
  isImageDeprecated: boolean;
};

export type TPartialInstanceDto = Pick<TAggregatedInstanceDto, 'id'> &
  Partial<TAggregatedInstanceDto>;

export type TRetrieveInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: string;
  searchValue?: string;
}>;

type TInstanceSubnetDto = TSubnet;

type TInstanceAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  subnet?: TInstanceSubnetDto;
};

export type TInstanceVolumeDto = {
  id: string;
  name?: string;
  size?: number;
};

type TInstanceRegionTypeDto = TRegionType;

type TInstanceFlavorSpecDto = TFlavorSpec;

type TInstanceFlavorDto = {
  id: string;
  name: string;
  specs: {
    cpu: TInstanceFlavorSpecDto;
    ram: TInstanceFlavorSpecDto;
    storage: TInstanceFlavorSpecDto;
    bandwidth: {
      public: TInstanceFlavorSpecDto;
      private: TInstanceFlavorSpecDto;
    };
  };
};

export type TInstancePriceDto = {
  type: 'hour' | 'month' | 'licence' | 'savingplans';
  status: 'enabled' | 'available' | 'eligible';
  includeVat: boolean;
  price: {
    currencyCode: string;
    priceInUCents: number;
    text: string;
    value: number;
  };
};

type TInstanceImageDto = TImage;

type TInstanceBackupDto = TBackup;

export type TInstanceDto = {
  id: string;
  name: string;
  quantity: number;
  region: string;
  regionType: TInstanceRegionTypeDto;
  availabilityZone: string | null;
  pendingTask: boolean;
  taskState: string;
  sshKey: string;
  login?: string;
  addresses: TInstanceAddressDto[];
  status: TInstanceStatusDto;
  actions: TInstanceActionDto[];
  volumes?: TInstanceVolumeDto[];
  flavor?: TInstanceFlavorDto;
  pricings?: TInstancePriceDto[];
  image?: TInstanceImageDto;
  backups?: TInstanceBackupDto[];
};

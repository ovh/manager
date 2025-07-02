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

export type TAggregatedInstanceDto = {
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

type TSubnetDto = TSubnet;

type TAddressDto = {
  ip: string;
  version: number;
  type: TInstanceAddressTypeDto;
  subnet?: TSubnetDto;
};

export type TVolumeDto = {
  id: string;
  name?: string;
  size?: number;
};

type TFlavorSpecDto = TFlavorSpec;

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

type TInstancePriceDto = TInstancePrice;

type TImageDto = TImage;

type TBackupDto = TBackup;

export type TInstanceDto = {
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

import { v6 } from '@ovh-ux/manager-core-api';
import { DeepReadonly } from '@/types/utils.type';

type TInstanceDtoAddressType = 'public' | 'private';

type TInstanceDtoAddress = {
  ip: string;
  version: number;
  type: TInstanceDtoAddressType;
  gatewayIp: string;
};

export type TInstanceStatusDto =
  | 'ACTIVE'
  | 'BUILDING'
  | 'DELETED'
  | 'DELETING'
  | 'ERROR'
  | 'HARD_REBOOT'
  | 'PASSWORD'
  | 'PAUSED'
  | 'REBOOT'
  | 'REBUILD'
  | 'RESCUED'
  | 'RESIZED'
  | 'REVERT_RESIZE'
  | 'SOFT_DELETED'
  | 'STOPPED'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'VERIFY_RESIZE'
  | 'MIGRATING'
  | 'RESIZE'
  | 'BUILD'
  | 'SHUTOFF'
  | 'RESCUE'
  | 'SHELVED'
  | 'SHELVING'
  | 'UNSHELVING'
  | 'SHELVED_OFFLOADED'
  | 'RESCUING'
  | 'UNRESCUING'
  | 'SNAPSHOTTING'
  | 'RESUMING';

export type TInstanceDto = DeepReadonly<{
  addresses: TInstanceDtoAddress[];
  flavorId: string;
  flavorName: string;
  id: string;
  imageId: string;
  imageName: string;
  name: string;
  region: string;
  status: TInstanceStatusDto;
}>;

export type TRetrieveInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: string;
  searchValue?: string;
}>;

export const getInstances = (
  projectId: string,
  {
    limit,
    sort,
    sortOrder,
    offset,
    searchField,
    searchValue,
  }: TRetrieveInstancesQueryParams,
): Promise<TInstanceDto[]> =>
  v6
    .get(`/cloud/project/${projectId}/aggregated/instance`, {
      params: {
        limit: limit + 1,
        sort,
        sortOrder,
        offset,
        searchField,
        searchValue,
      },
    })
    .then((response) => response.data);

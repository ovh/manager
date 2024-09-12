import { v6 } from '@ovh-ux/manager-core-api';
import { DeepReadonly } from '@/types/utils.type';

type InstanceDtoId = string;
type FlavorDtoId = string;
type ImageDtoId = string;
type InstanceDtoAddressType = 'public' | 'private';

type InstanceDtoAddress = {
  ip: string;
  version: number;
  type: InstanceDtoAddressType;
  gatewayIp: string;
};

export type InstanceStatusDto =
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

export type InstanceDto = DeepReadonly<{
  addresses: InstanceDtoAddress[];
  flavorId: FlavorDtoId;
  flavorName: string;
  id: InstanceDtoId;
  imageId: ImageDtoId;
  imageName: string;
  name: string;
  region: string;
  status: InstanceStatusDto;
}>;

export type RetrieveInstancesQueryParams = {
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: string;
  searchValue?: string;
};

export const retrieveInstances = (
  projectId: string,
  {
    limit,
    sort,
    sortOrder,
    offset,
    searchField,
    searchValue,
  }: RetrieveInstancesQueryParams,
): Promise<InstanceDto[]> =>
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

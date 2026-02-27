import { v6 } from '@ovh-ux/manager-core-api';

import { TShareDto } from '@/adapters/shares/right/dto.type';
import { mapShareDtoToShare } from '@/adapters/shares/right/mapper';
import { TShare, TShareToCreate } from '@/domain/entities/share.entity';

export type TGetSharesQueryParams = Readonly<{
  limit: number;
  sort: 'creationDate' | 'name' | 'region' | 'size';
  sortOrder: 'asc' | 'desc';
  offset?: number;
  searchField?: 'name' | 'region' | 'shareID';
  searchValue?: string;
}>;

const defaultGetSharesQueryParams: TGetSharesQueryParams = {
  limit: 10,
  sort: 'name',
  sortOrder: 'asc',
};

export const getShares = async (
  projectId: string,
  params: TGetSharesQueryParams = defaultGetSharesQueryParams,
): Promise<TShare[]> => {
  const { limit, sort, sortOrder, offset, searchField, searchValue } = params;
  return v6
    .get<TShareDto[]>(`/cloud/project/${projectId}/aggregated/share`, {
      params: {
        limit,
        sort,
        sortOrder,
        offset,
        searchField,
        searchValue,
      },
    })
    .then((response) => response.data.map(mapShareDtoToShare));
};

export const getShare = async (
  projectId: string,
  shareRegion: string,
  shareId: string,
): Promise<TShare> => {
  return v6
    .get<TShareDto>(`/cloud/project/${projectId}/region/${shareRegion}/share/${shareId}`)
    .then((response) => mapShareDtoToShare(response.data));
};

export const deleteShare = async (
  projectId: string,
  region: string,
  shareId: string,
): Promise<void> => {
  await v6.delete(`/cloud/project/${projectId}/region/${region}/share/${shareId}`);
};

export const createShare = async ({
  projectId,
  shareToCreate,
}: {
  projectId: string;
  shareToCreate: TShareToCreate;
}): Promise<void> => {
  await v6.post<unknown>(`/cloud/project/${projectId}/region/${shareToCreate.region}/share`, {
    name: shareToCreate.name,
    type: shareToCreate.type,
    networkId: shareToCreate.network.id,
    size: shareToCreate.size,
    subnetId: shareToCreate.network.subnetId,
  });
};

export const updateShare = async ({
  projectId,
  shareId,
  region,
  name,
}: {
  projectId: string;
  shareId: string;
  region: string;
  name: string;
}): Promise<void> => {
  await v6.put(`/cloud/project/${projectId}/region/${region}/share/${shareId}`, {
    name,
  });
};

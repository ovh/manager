import { v6 } from '@ovh-ux/manager-core-api';

import { TAggregatedSharesDto, TShareDto } from '@/adapters/shares/right/dto.type';
import { mapShareDtoToShare } from '@/adapters/shares/right/mapper';
import { TShare, TShareToCreate } from '@/domain/entities/share.entity';

export const getShares = async (projectId: string): Promise<TShare[]> => {
  return v6
    .get<TAggregatedSharesDto>(`/cloud/project/${projectId}/aggregated/share`)
    .then((response) => response.data.resources.map(mapShareDtoToShare));
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

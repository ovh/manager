import { v6 } from '@ovh-ux/manager-core-api';

import { TShareDto } from '@/adapters/shares/right/dto.type';
import { mapShareDtoToShare } from '@/adapters/shares/right/mapper';
import { TShare } from '@/domain/entities/share.entity';

export const getShares = async (projectId: string): Promise<TShare[]> => {
  return v6
    .get<TShareDto[]>(`/cloud/project/${projectId}/region/GRA9/share`)
    .then((response) => response.data.map(mapShareDtoToShare));
};

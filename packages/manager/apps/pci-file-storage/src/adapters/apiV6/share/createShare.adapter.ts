import { v6 } from '@ovh-ux/manager-core-api';

import { CreateSharePort } from '@/application/ports/createShare.port';
import { CreateShare } from '@/domain/entities/share.entity';

export const createShareAdapter: CreateSharePort = {
  createShare: async (params: { projectId: string; createShare: CreateShare }): Promise<void> => {
    await v6.post<unknown>(
      `/cloud/project/${params.projectId}/region/${params.createShare.region}/share`,
      params.createShare,
    );
  },
};

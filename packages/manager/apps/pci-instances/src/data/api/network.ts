import { v6 } from '@ovh-ux/manager-core-api';
import { TNetwork } from '@/types/network/entity.type';

export const getNetwork = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TNetwork[]> =>
  v6
    .get(`/cloud/project/${projectId}/region/${region}/network`)
    .then((response) => response.data);

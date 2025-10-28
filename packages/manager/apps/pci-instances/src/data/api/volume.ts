import { v6 } from '@ovh-ux/manager-core-api';
import { TVolume } from '@/types/volume/common.type';
import { TVolumeDto } from '@/types/volume/api.type';

export const getVolumes = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TVolume[]> =>
  v6
    .get<TVolumeDto[]>(`/cloud/project/${projectId}/region/${region}/volume`)
    .then((response) => response.data);

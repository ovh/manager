import { v6 } from '@ovh-ux/manager-core-api';
import { TVolume } from '@/types/volume/entity.type';
import { TVolumeDto } from '@/types/volume/api.type';
import { mapDtoToVolume } from './mapper/volume.mapper';

export const getVolumes = ({
  projectId,
  region,
}: {
  projectId: string;
  region: string;
}): Promise<TVolume[]> =>
  v6
    .get<TVolumeDto[]>(`/cloud/project/${projectId}/region/${region}/volume`)
    .then((response) => response.data.map(mapDtoToVolume));

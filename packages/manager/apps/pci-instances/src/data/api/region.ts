import { v6 } from '@ovh-ux/manager-core-api';
import { TActivatedRegionDto } from '@/types/region/api.types';

export const activateRegion = (
  projectId: string,
  region: string,
): Promise<TActivatedRegionDto> =>
  v6
    .post(`/cloud/project/${projectId}/region`, { region })
    .then((response) => response.data);

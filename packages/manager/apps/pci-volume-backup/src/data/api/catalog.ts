import { v6 } from '@ovh-ux/manager-core-api';
import { TVolumeCatalog } from '@/data/api/api.types';

export const getVolumeCatalog = async (
  projectId: string,
): Promise<TVolumeCatalog> =>
  (await v6.get<TVolumeCatalog>(`/cloud/project/${projectId}/catalog/volume`))
    .data;

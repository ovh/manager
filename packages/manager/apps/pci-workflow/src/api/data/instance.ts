import { v6 } from '@ovh-ux/manager-core-api';

import { mapDtoToInstance } from '@/api/data/mapper/instance.mapper';
import { TInstanceDto } from '@/types/instance/api';

export const getInstances = async (projectId: string) => {
  const { data } = await v6.get<TInstanceDto[]>(`/cloud/project/${projectId}/instance`);

  return data.map(mapDtoToInstance);
};

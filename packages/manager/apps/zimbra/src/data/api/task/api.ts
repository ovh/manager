import { v2 } from '@ovh-ux/manager-core-api';
import { TaskType } from './type';
import { getApiPath } from '@/data/api';

export const getZimbraPlatformTask = async (
  platformId: string,
  organizationId?: string,
) => {
  const { data } = await v2.get<TaskType[]>(
    `${getApiPath(platformId)}task${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
  );
  return data;
};

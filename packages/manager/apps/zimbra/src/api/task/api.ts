import { v2 } from '@ovh-ux/manager-core-api';
import { TaskType } from './type';

export const getZimbraPlatformTask = async (
  platformId: string,
  organizationId?: string,
) => {
  const { data } = await v2.get<TaskType[]>(
    `/zimbra/platform/${platformId}/task${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
  );
  return data;
};

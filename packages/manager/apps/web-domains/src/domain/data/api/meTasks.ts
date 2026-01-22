import { taskMeDomain, TaskTypesEnum } from '@/domain/constants/meTasks';
import { v6 } from '@ovh-ux/manager-core-api';

/**
 * Get information about domain related tasks
 */
export const getMeTaskIds = async (
  serviceName: string,
  taskType?: TaskTypesEnum,
): Promise<number[]> => {
  const taskQueryParam = taskType ? `&function=${taskType}` : '';
  return v6
    .get(`${taskMeDomain.join('/')}?domain=${serviceName}&type=domain${taskQueryParam}`)
    .then((res) => res.data);
};

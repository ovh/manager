import { v6 } from '@ovh-ux/manager-core-api';
import { TaskDetailsType } from '../type';
import { ITEMS_PER_PAGE } from '@/constants';

interface PageParam {
  pageNumber: number;
  totalPage?: number;
}

export const getHostingTasks = async (
  serviceName: string,
  pageParam: PageParam,
): Promise<{
  data: TaskDetailsType[];
  pageParam: PageParam;
}> => {
  const taskHeaders = {
    'X-Pagination-Mode': 'CachedObjectList-Pages',
    'X-Pagination-Size': ITEMS_PER_PAGE,
    'X-Pagination-Number': pageParam?.pageNumber,
  };
  const { data, headers } = await v6.get<TaskDetailsType[]>(
    `/hosting/web/${serviceName}/tasks`,
    { headers: taskHeaders },
  );
  const totalPage = Number(headers['x-pagination-total']);
  return { data, pageParam: { totalPage, ...pageParam } };
};

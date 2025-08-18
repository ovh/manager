import { useInfiniteQuery } from '@tanstack/react-query';
import { getHostingTasks } from '@/data/api/task';
import { ITEMS_PER_PAGE } from '@/constants';

export const useGetTaskDetails = (serviceName: string) => {
  return useInfiniteQuery({
    queryKey: ['hosting', 'web', serviceName, 'tasks'],
    queryFn: ({ pageParam }) => getHostingTasks(serviceName, pageParam),
    initialPageParam: { pageNumber: 1 },
    enabled: !!serviceName,
    staleTime: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage?.pageParam?.pageNumber < lastPage?.pageParam?.totalPage) {
        return { pageNumber: lastPage?.pageParam?.pageNumber + 1 };
      }
      return undefined;
    },
    select: (data) => {
      return data.pages.flatMap((page) =>
        page.data.length > ITEMS_PER_PAGE
          ? page.data.slice(0, ITEMS_PER_PAGE)
          : page.data,
      );
    },
  });
};

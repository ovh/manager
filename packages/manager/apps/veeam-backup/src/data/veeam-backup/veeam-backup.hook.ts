import { useInfiniteQuery } from '@tanstack/react-query';
import { getListingIcebergV2 } from './veeam-backup.api';

export const veeamBackupListQueryKey = ['servicesListingIceberg'];

export const useVeeamBackupList = ({ pageSize }: { pageSize: number }) =>
  useInfiniteQuery({
    initialPageParam: null,
    queryKey: veeamBackupListQueryKey,
    queryFn: ({ pageParam }) =>
      getListingIcebergV2({ pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext as any,
  });

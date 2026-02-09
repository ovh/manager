import { getOkms, getOkmsList, okmsQueryKeys } from '@key-management-service/data/api/okms';
import { OKMS } from '@key-management-service/types/okms.type';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { useDataApi } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

export const useOkmsById = (okmsId: string) => {
  return useQuery<OKMS, ErrorResponse>({
    queryKey: okmsQueryKeys.detail(okmsId),
    queryFn: () => getOkms(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

/**
 * okms list hook
 *
 * @description only use this hook to manage side-effects on the UI (region selector, back button, redirection).
 * for the okms list datagrid, use `useOkmsDatagridList`
 */
export const useOkmsList = (options: Partial<UseQueryOptions<OKMS[], ErrorResponse>> = {}) => {
  return useQuery<OKMS[], ErrorResponse>({
    queryKey: okmsQueryKeys.list,
    queryFn: getOkmsList,
    ...options,
  });
};

type UseOkmsDatagridListParams = {
  pageSize?: number;
};

export const useOkmsDatagridList = (params: UseOkmsDatagridListParams = {}) => {
  const { pageSize = 10 } = params;

  return useDataApi<OKMS>({
    iceberg: true,
    enabled: true,
    version: 'v2',
    route: '/okms/resource',
    cacheKey: okmsQueryKeys.listDatagrid,
    pageSize,
  });
};

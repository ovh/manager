import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import { getOkms, getOkmsList, okmsQueryKeys } from '@/data/api/okms';

export const useOkmsById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
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
export const useOkmsList = (
  options: Partial<UseQueryOptions<OKMS[], ErrorResponse>> = {},
) => {
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

  return useResourcesIcebergV2<OKMS>({
    route: '/okms/resource',
    queryKey: okmsQueryKeys.listDatagrid,
    pageSize,
  });
};

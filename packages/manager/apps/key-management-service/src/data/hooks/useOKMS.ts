import { useQuery } from '@tanstack/react-query';
import apiClient from '@ovh-ux/manager-core-api';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '../api/okms';

export const getOKMSResource = async (
  okmsId: string,
): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};

export const useOKMSById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
    queryKey: getOkmsResourceQueryKey(okmsId),
    queryFn: () => getOKMSResource(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useOKMSList = ({
  pageSize,
  shouldFetchAll,
}: {
  pageSize?: number;
  shouldFetchAll?: boolean;
}) => {
  // return useResourcesIcebergV2<OKMS>({
  //   route: '/okms/resource',
  //   queryKey: getOkmsServicesResourceListQueryKey,
  //   pageSize,
  //   shouldFetchAll,
  // });
  const { data, ...rest } = useResourcesIcebergV2<OKMS>({
    route: '/okms/resource',
    queryKey: getOkmsServicesResourceListQueryKey,
    pageSize,
    shouldFetchAll,
  });

  console.info('data', data);
  const tmp = [...(data?.pages[0].data || []), ...(data?.pages[0].data || [])];

  console.info('tmp', tmp);
  const test = tmp.map((item, index) => ({
    ...item,
    id: `${item.id}-${index}-coucou`,
  }));

  console.info('test condition 1', test);

  return {
    flattenData: test,
    data: { pages: [{ data: test }] },
    ...rest,
  };
};

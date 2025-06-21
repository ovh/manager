import { useQuery } from '@tanstack/react-query';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getOkmsResource,
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '@/data/api/okms';

export const useOkmsById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
    queryKey: getOkmsResourceQueryKey(okmsId),
    queryFn: () => getOkmsResource(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useOkmsList = ({
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

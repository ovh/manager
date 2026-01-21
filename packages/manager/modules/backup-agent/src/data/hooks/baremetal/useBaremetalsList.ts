import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

import { Baremetal } from '@/types/Baremetal.type';
import { BAREMETAL_LIST_ROUTE } from '@/utils/apiRoutes';

export const BAREMETAL_QUERY_KEYS = {
  baremetals: ['baremetals'],
};

type UseBaremetalsListParams = {
  pageSize: number;
};

export const useBaremetalsList = (
  { pageSize = 9999 }: UseBaremetalsListParams = { pageSize: 9000 },
) =>
  useResourcesIcebergV6<Baremetal>({
    route: BAREMETAL_LIST_ROUTE,
    queryKey: BAREMETAL_QUERY_KEYS.baremetals,
    pageSize,
  });

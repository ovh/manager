import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

import { Baremetal } from '@/types/Baremetal.type';
import { BAREMETAL_LIST_ROUTE, getBaremetalDetailsRoute } from '@/utils/apiRoutes';

export const getBaremetals = async () => {
  const { data } = await fetchIcebergV6<Baremetal>({
    route: BAREMETAL_LIST_ROUTE,
    pageSize: 9999,
  });
  return data;
};

export const getBaremetalDetails = async (serviceName: string) => {
  const { data } = await v6.get<Baremetal>(getBaremetalDetailsRoute(serviceName));
  return data;
};

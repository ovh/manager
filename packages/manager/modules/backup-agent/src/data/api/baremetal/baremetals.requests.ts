import { v6 } from '@ovh-ux/manager-core-api';

import { Baremetal } from '@/types/Baremetal.type';
import { getBaremetalDetailsRoute } from '@/utils/apiRoutes';

export const getBaremetalDetails = async (serviceName: string) => {
  const { data } = await v6.get<Baremetal>(getBaremetalDetailsRoute(serviceName));
  return data;
};

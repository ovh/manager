import { v6 } from '@ovh-ux/manager-core-api';

import { ServiceConsumption } from '@/types/Consumption.type';
import { getServiceConsumptionRoute } from '@/utils/apiRoutes';

export const getServiceConsumption = async (serviceId: string | number) => {
  const { data } = await v6.get<ServiceConsumption[]>(
    getServiceConsumptionRoute(serviceId.toString()),
  );
  return data;
};

import { v6 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import {
  mockLicenseConsumptions,
  mockStorageConsumptions,
} from '@/mocks/consumptions/consumptions.mock';
import { ServiceConsumption } from '@/types/Consumption.type';
import { getLicenseConsumptionRoute, getServiceConsumptionRoute } from '@/utils/apiRoutes/apiRoutes';

/** Stockage d'un vault (§3.1 de la spec BKP-1225) : `quantity` et `price` en un seul appel. */
export const getServiceConsumption = async (serviceId: string): Promise<ServiceConsumption[]> => {
  if (USE_API_MOCKS) return mockStorageConsumptions[serviceId] ?? [];

  const { data } = await v6.get<ServiceConsumption[]>(getServiceConsumptionRoute(serviceId));
  return data;
};

/** Prix de la licence (§3.2) : pas de `quantity` à lire, `/consumption` sans `/element`. */
export const getLicenseConsumption = async (serviceId: string): Promise<ServiceConsumption[]> => {
  if (USE_API_MOCKS) return mockLicenseConsumptions[serviceId] ?? [];

  const { data } = await v6.get<ServiceConsumption[]>(getLicenseConsumptionRoute(serviceId));
  return data;
};

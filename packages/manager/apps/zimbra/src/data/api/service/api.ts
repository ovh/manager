import { IcebergFetchParamsV6, fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '@ovh-ux/manager-react-components';

import { buildURLSearchParams } from '@/utils';

import { SlotServiceBodyParamsType } from './type';
import { makeSlotServiceHashmap } from './utils';

// GET

export const getServices = (
  params: Omit<IcebergFetchParamsV6, 'route'> & { searchParams?: string } = {},
) => {
  const { searchParams, ...options } = params;
  return fetchIcebergV6<ServiceDetails>({
    route: `/services${searchParams || ''}`,
    ...options,
  });
};

export const getSlotServices = async () => {
  const searchParams = buildURLSearchParams({
    routes: '/zimbra/slot/{slotId}',
  });
  const { data } = await getServices({
    searchParams,
    disableCache: true,
    pageSize: 50000,
  });

  // create a lookup table slotId->slotService
  return makeSlotServiceHashmap(data);
};

export const getServiceByResourceName = async (resourceName: string): Promise<ServiceDetails> => {
  const searchParams = buildURLSearchParams({
    resourceName,
    routes: '/zimbra/slot/{slotId}',
  });
  const { data } = await getServices({
    searchParams,
    disableCache: true,
    pageSize: 1,
  });

  return data?.[0];
};

// PUT

export const putService = async (serviceId: number, params: SlotServiceBodyParamsType) => {
  const { data } = await v6.put(`services/${serviceId}`, params);
  return data;
};

import { fetchIcebergV6, IcebergFetchParamsV6 } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '@ovh-ux/manager-react-components';
import { buildURLSearchParams } from '@/utils';
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

import apiClient from '@ovh-ux/manager-core-api';

import { BaremetalDetails } from '@/types/Baremetal.type';

const getBaremetalsServicesRoute = () => `/dedicatedCloud`;

export const getBaremetalDetails = async () =>
  (
    await apiClient.v6.get<BaremetalDetails[]>(getBaremetalsServicesRoute(), {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Filter': 'productReference:eq=MBM',
      },
    })
  ).data;

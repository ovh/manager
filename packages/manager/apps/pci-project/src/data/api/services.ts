import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TService } from '../service.type';

export const getServices = async (): Promise<FetchResultV6<TService>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-filter': `${encodeURIComponent(
      'route.path',
    )}:eq=${encodeURIComponent('/cloud/project/{serviceName}')}`,
  };
  const data = await v6.get(`/services`, { headers });
  return data;
};

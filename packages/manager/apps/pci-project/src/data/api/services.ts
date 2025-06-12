import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TService } from '../types/service.type';

export const getServices = async (): Promise<FetchResultV6<TService>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-filter': `${encodeURIComponent(
      'route.path',
    )}:eq=${encodeURIComponent(
      '/cloud/project/{serviceName}',
    )}&${encodeURIComponent(
      'billing.lifecycle.current.state',
    )}:ne=${encodeURIComponent('terminated')}`,
  };
  return v6.get(`/services`, { headers });
};

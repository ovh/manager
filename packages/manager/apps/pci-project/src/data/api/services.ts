import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import {
  TCartServiceOption,
  TService,
  TServiceOption,
} from '@/data/types/service.type';

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

export const getProjectService = async (
  projectId: string,
): Promise<TService> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/serviceInfos`);
  return data;
};

/**
 * Get service options from a service id
 * @param serviceId
 * @returns {Promise<TServiceOption>} a list of service options
 */
export const getServiceOptions = async (
  serviceId: number,
): Promise<TServiceOption[]> => {
  const { data } = await v6.get(`/services/${serviceId}/options`);
  return data;
};

/**
 * Retrieves the service ID(s) associated with a given projectId.
 * @param {string} projectId
 * @returns {Promise<number[]>}
 */
export const getServiceId = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<Promise<number[]>>(
    `/services?resourceName=${projectId}`,
  );
  return data;
};

/**
 * Retrieves the available cart service options for a given project.
 *
 * @param {string} projectId
 * @returns {Promise<TCartServiceOption[]>}
 */
export const getCartServiceOption = async (
  projectId: string,
): Promise<TCartServiceOption[]> => {
  const { data } = await v6.get(`/order/cartServiceOption/cloud/${projectId}`);
  return data;
};

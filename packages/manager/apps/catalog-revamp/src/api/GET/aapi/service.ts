import { queryClient } from '@ovh-ux/manager-react-core-application';
import { apiClient } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';

export const getManagerHubCatalogListQueryKey = ['/hub/catalog'];

/**
 * Manager-catalog endpoints : Get manager-catalog
 */
export const getManagerHubCatalogList = async (): Promise<unknown[]> => {
  const fetchData = async () => {
    const config = {
      headers: {
        'Content-Language': i18next.language.replace('-', '_'),
      },
    };
    const response: any = await apiClient.aapi.get('/hub/catalog', config);
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(getManagerHubCatalogListQueryKey, fetchData);
};

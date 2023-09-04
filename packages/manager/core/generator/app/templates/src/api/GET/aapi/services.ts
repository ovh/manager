import { queryClient } from '@ovh-ux/manager-react-core-application';
import { apiClient } from '@ovh-ux/manager-core-api';

type Item = unknown;

export const getProduct360ManagerHubCatalogListQueryKey = ['/hub/catalog'];

/**
 * Manager-catalog endpoints : Get manager-catalog
 */
export const getProduct360ManagerHubCatalogList = async (): Promise<Item[]> => {
  const fetchData = async () => {
    const response: any = await apiClient.aapi.get('/hub/catalog');
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      console.error('Error with request', errorResponse);
      return errorResponse;
    }
    return response.data;
  };

  return queryClient.fetchQuery(
    getProduct360ManagerHubCatalogListQueryKey,
    fetchData,
  );
};

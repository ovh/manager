import { queryClient } from '@ovh-ux/manager-react-core-application';
import { apiClient } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';

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

// -----

export interface PIMElement {
  id: number;
  name: string;
  description: string;
  lang: string;
  categories: string[];
  regionTags: string[];
}

export const getPIMServiceQueryKey = [`/products/list`];

/**
 * Using the PIM ID `{{this.pimID}}` to search in PIM data model
 */
export const getPIMService = async (): Promise<string[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get('/products/list');
    const currentLang = i18next.language
      ? i18next.language.replace('-', '_')
      : 'fr_FR';
    return response.data;
  };

  return queryClient.fetchQuery(getPIMServiceQueryKey, fetchData);
};

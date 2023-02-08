import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';

async function fetchData() {
  const response = await apiClient.v6.get('/dedicated/nasha');
  return response.data;
}

export const QUERY_KEY = ['/dedicated/nasha'];

export const getNashaReactAppIds = async (): Promise<string[]> => {
  return queryClient.fetchQuery(QUERY_KEY, fetchData);
};

export default {
  QUERY_KEY,
  getNashaReactAppIds,
};

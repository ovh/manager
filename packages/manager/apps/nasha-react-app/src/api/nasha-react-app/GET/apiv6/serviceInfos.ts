import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { SELECTED_NAS } from '../../config';

export const QUERY_KEY = ['/dedicated/nasha/'+SELECTED_NAS+'/serviceInfos'];

async function fetchData() {
  const response = await apiClient.v6.get(QUERY_KEY[0]);
  return response.data;
}

export const getNashaServiceInfos = async (): Promise<string[]> => {
  return queryClient.fetchQuery(QUERY_KEY, fetchData);
};

export default {
  QUERY_KEY,
  getNashaServiceInfos,
};

import apiClient from '@ovh-ux/manager-core-api';

export const QUERY_KEY = ['/dedicated/nasha'];

export async function fetchNashaList() {
  const response = await apiClient.v6.get(QUERY_KEY[0]);
  return response.data;
}

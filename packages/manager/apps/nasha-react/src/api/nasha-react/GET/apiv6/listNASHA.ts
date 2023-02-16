import apiClient from '@ovh-ux/manager-core-api';

export default async function fetchNashaList() {
  const response = await apiClient.v6.get('/dedicated/nasha');
  return response.data;
}

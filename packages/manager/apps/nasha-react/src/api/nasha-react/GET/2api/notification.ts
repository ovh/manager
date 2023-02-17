import apiClient from '@ovh-ux/manager-core-api';

export const QUERY_KEY = ['/dedicated/nasha'];

export async function fetchNotification() {
  const response = await apiClient.aapi.get(
    'notification?target=EU&lang=fr_FR',
  );
  return response.data;
}

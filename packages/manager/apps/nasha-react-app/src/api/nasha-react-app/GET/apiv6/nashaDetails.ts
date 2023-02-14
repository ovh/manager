import apiClient from '@ovh-ux/manager-core-api';
import { SELECTED_NAS } from '../../config';

const QUERY_KEY = [`/dedicated/nasha/${SELECTED_NAS}`];

export async function fetchNashaDetails() {
  const response = await apiClient.v6.get(QUERY_KEY[0]);
  return response.data;
}
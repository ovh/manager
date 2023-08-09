/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { apiClient } from '@ovh-ux/manager-core-api';
import { SortOrder } from './tailLogsTypes';

export async function fetchLogs(
  source: string,
  sort: SortOrder,
  logLimit: number,
) {
  try {
    const queryParams = `&sort=${sort}&limit=${logLimit}`;
    const requestUrl = source + queryParams;
    const response = await apiClient.v6.get(requestUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching and processing logs:', error);
    return [];
  }
}

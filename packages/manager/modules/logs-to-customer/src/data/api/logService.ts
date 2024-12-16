import apiClient from '@ovh-ux/manager-core-api';
import { Service } from '../types/dbaas/logs';

/**
 * GET log service infos
 */
export const getLogService = async (serviceName: string) =>
  apiClient.v6.get<Service>(`/dbaas/logs/${serviceName}`);

import { apiClient } from '@ovh-ux/manager-core-api';

export const getVrackListQueryKey = ['get/vrack'];

export const getVrackList = () => apiClient.v6.get<string[]>('/vrack');

import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '../..';
import { AppSuggestions } from '@/types/orderFunnel';

export const getSuggestions = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/suggestion/app`)
    .then((res) => res.data as AppSuggestions);

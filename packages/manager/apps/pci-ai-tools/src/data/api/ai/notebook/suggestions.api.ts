import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '../..';
import { NotebookSuggestions } from '@/types/orderFunnel';

export const getSuggestions = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/suggestion/notebook`)
    .then((res) => res.data as NotebookSuggestions);

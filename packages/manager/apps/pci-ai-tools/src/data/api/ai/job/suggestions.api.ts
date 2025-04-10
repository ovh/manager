import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '../..';

import { JobSuggestions } from '@/types/orderFunnel';

export const getSuggestions = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/suggestion/job`)
    .then((res) => res.data as JobSuggestions);

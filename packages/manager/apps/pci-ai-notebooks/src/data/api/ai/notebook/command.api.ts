import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';

import { AddNotebook } from './notebook.api';

export const getCommand = async ({ projectId, notebookInfo }: AddNotebook) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/notebook/command`, notebookInfo)
    .then((res) => res.data as ai.Command);

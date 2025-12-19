import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '../..';
import { NotebookSuggestions } from '@/types/orderFunnel';

export const getQuantumSuggestions = (
  { projectId }: PCIAi,
  quantumType: string,
) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/ai/suggestion/notebook-quantum/${quantumType}`,
    )
    .then((res) => res.data as NotebookSuggestions);

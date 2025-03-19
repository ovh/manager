import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '../..';
import ai from '@/types/AI';
import { mockedSuggestionsForNotebook } from '@/__tests__/helpers/mocks/suggestion';

export const getSuggestions = async (/* { projectId }: PCIAi */) => {
  // apiClient.v6
  //   .get(`/cloud/project/${projectId}/ai/suggestion/notebook`)
  //   .then((res) => res.data as ai.notebook.Notebook);
  return mockedSuggestionsForNotebook;
};

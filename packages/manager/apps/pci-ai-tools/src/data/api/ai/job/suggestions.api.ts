// import { apiClient } from '@ovh-ux/manager-core-api';
// import { PCIAi } from '../..';
// import { Suggestions } from '@/types/orderFunnel';

import { mockedSuggestionsForJob } from '@/__tests__/helpers/mocks/suggestion';

export const getSuggestions = async (/* { projectId }: PCIAi */) => {
  /*  
    apiClient.v6
      .get(`/cloud/project/${projectId}/ai/notebook/suggestions`)
      .then((res) => res.data as Suggestions[]);
      */
  return mockedSuggestionsForJob;
};

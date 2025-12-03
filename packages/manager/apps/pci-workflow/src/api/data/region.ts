import { AxiosResponse } from 'axios';

import { v6 } from '@ovh-ux/manager-core-api';

interface EnableRegionResponse {
  status?: string;
}

export const enableRegion = (params: {
  projectId: string;
  region: string;
}): Promise<AxiosResponse<EnableRegionResponse>> => {
  const { projectId, region } = params;
  return v6.post<EnableRegionResponse>(`/cloud/project/${projectId}/region`, { region });
};

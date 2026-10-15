import { v6 } from '@ovh-ux/manager-core-api';

interface EnableRegionResponse {
  status?: string;
}

// the type is derived from the client: naming axios here would resolve a second copy of it
export const enableRegion = (params: {
  projectId: string;
  region: string;
}): ReturnType<typeof v6.post<EnableRegionResponse>> => {
  const { projectId, region } = params;
  return v6.post<EnableRegionResponse>(`/cloud/project/${projectId}/region`, { region });
};

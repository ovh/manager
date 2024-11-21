import { apiClient } from '@ovh-ux/manager-core-api';

export const postTracking = async (projectId: string, track: string) => {
  await apiClient.v6.post(
    `/cloud/project/${projectId}/dummyTrack`,
    {
      key: track,
    },
    {
      headers: {
        keepalive: true,
      },
    },
  );
};

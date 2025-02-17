import { v6 } from '@ovh-ux/manager-core-api';

export type DownloadRCloneConfigResult = {
  content: string;
};

export const downloadRCloneConfig = async ({
  projectId,
  userId,
  region,
  service,
}: {
  projectId: string;
  userId: string;
  region: string;
  service: string;
}): Promise<DownloadRCloneConfigResult> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/rclone`,
    {
      params: {
        region,
        service,
      },
    },
  );

  return data;
};

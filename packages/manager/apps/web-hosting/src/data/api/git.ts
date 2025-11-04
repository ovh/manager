import { v6 } from '@ovh-ux/manager-core-api';

export const deleteGitAssociation = async (
  serviceName: string,
  webSiteId: string,
  deleteFiles?: boolean,
) => {
  const { data } = await v6.delete<void>(
    `/hosting/web/${serviceName}/website/${webSiteId}?deleteFiles=${deleteFiles}`,
  );

  return data;
};

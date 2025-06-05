import { v6 } from '@ovh-ux/manager-core-api';

export const enableIAMAuthentication = async (
  projectId: string,
  registryId: string,
  deleteUsers?: boolean | null,
) => {
  const {
    data,
  } = await v6.post(
    `cloud/project/${projectId}/containerRegistry/${registryId}/iam`,
    { deleteUsers },
  );
  return data;
};

export const disableIAMAuthentication = async (
  projectId: string,
  registryId: string,
) => {
  const { data } = await v6.delete(
    `cloud/project/${projectId}/containerRegistry/${registryId}/iam`,
  );
  return data;
};

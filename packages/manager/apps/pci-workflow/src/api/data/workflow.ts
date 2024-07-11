import { v6 } from '@ovh-ux/manager-core-api';

export const deleteWorkflow = async (
  projectId: string,
  region: string,
  workflowId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/workflow/backup/${workflowId}`,
  );
  return data;
};

import { v6 } from '@ovh-ux/manager-core-api';

export type TExecutionState = 'SUCCESS' | 'PAUSED' | 'ERROR';

export type TWorkflowExecution = {
  id: string;
  state: TExecutionState;
  executedAt: string;
};

export type TRemoteWorkflow = {
  backupName: string;
  name: string;
  id: string;
  instanceId: string;
  cron: string;
  executions: TWorkflowExecution[];
};

export const getRegionsWorkflows = async (
  projectId: string,
  regionName: string,
) => {
  const { data } = await v6.get<TRemoteWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/workflow/backup`,
  );
  return data;
};

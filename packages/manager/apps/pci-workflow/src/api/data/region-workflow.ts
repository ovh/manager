import { v6 } from '@ovh-ux/manager-core-api';

export type TExecutionState = 'SUCCESS' | 'PAUSED' | 'ERROR';

export type TWorkflowExecution = {
  id: string;
  state: TExecutionState;
  executedAt: string;
  executedAtDate?: string;
  executedAtTime?: string;
};

export type TRemoteWorkflow = {
  backupName: string;
  name: string;
  id: string;
  instanceId: string;
  cron: string;
  executions: TWorkflowExecution[] | null;
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

export const addWorkflow = async (
  projectId: string,
  regionName: string,
  type: {
    cron: string;
    instanceId: string;
    name: string;
    rotation: number;
    maxExecutionCount: number;
  },
) => {
  const { data } = await v6.post<TRemoteWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/workflow/backup`,
    { ...type },
  );
  return data;
};

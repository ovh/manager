import { v6 } from '@ovh-ux/manager-core-api';

export type TExecutionState = 'SUCCESS' | 'PAUSED' | 'ERROR' | 'CANCELED';

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
  distantRegion?: string;
};

export const getRegionsWorkflows = async (projectId: string, regionName: string) => {
  const { data } = await v6.get<TRemoteWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/workflow/backup`,
  );
  return data;
};

export type TAddWorkflow = {
  name: string;
  cron: string;
  rotation: number;
  imageName: string;
  distantImageName: string | null;
  distantRegionName: string | null;
};

export const addWorkflow = async (
  projectId: string,
  regionName: string,
  instanceId: string,
  type: TAddWorkflow,
) => {
  const { data } = await v6.post<TRemoteWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/autobackup`,
    { ...type },
  );
  return data;
};

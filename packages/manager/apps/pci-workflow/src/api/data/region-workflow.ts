import { v6 } from '@ovh-ux/manager-core-api';

export type TExecutionState = 'SUCCESS' | 'PAUSED' | 'ERROR';

export type TWorkflowExecution = {
  id: string;
  state: TExecutionState;
  executedAt: string;
  executedAtDate?: string;
  executedAtTime?: string;
};

export type TRemoteInstanceBackupWorkflow = {
  backupName: string;
  name: string;
  id: string;
  instanceId: string;
  cron: string;
  executions: TWorkflowExecution[] | null;
  distantRegion?: string;
};

export const getInstanceBackupWorkflows = async (projectId: string, regionName: string) => {
  const { data } = await v6.get<TRemoteInstanceBackupWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/workflow/backup`,
  );
  return data;
};

export type TAddWorkflow = {
  name: string;
  cron: string;
  rotation: number;
  imageName: string;
  distImageName: string | null;
  distRegionName: string | null;
};

export const addInstanceBackupWorkflow = async (
  projectId: string,
  regionName: string,
  instanceId: string,
  type: TAddWorkflow,
) => {
  const { data } = await v6.post<TRemoteInstanceBackupWorkflow[]>(
    `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/automaticBackup`,
    { ...type },
  );
  return data;
};

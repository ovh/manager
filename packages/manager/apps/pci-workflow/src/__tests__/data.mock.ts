import { TWorkflowBackup } from '@/api/hooks/workflows';

export const DEFAULT_DATA = {
  emptyPaginatedWorkflows: {
    data: {
      rows: [],
      totalRows: 0,
      pageCount: 0,
    },
    isPending: false,
  },
  fullPaginationWorkflows: {
    isPending: false,
    data: {
      rows: [
        {
          name: 'workflow1Name',
          id: 'workflow1Id',
          instanceId: 'workflow1InstanceId',
          instanceName: 'workflow1InstanceName',
          cron: 'workflow1Cron',
          lastExecution: '2021-09-01T00:00:00Z',
          lastExecutionStatus: 'SUCCESS',
          backupName: '',
          executions: [
            {
              id: 'workflow1Execution1Id',
              state: 'SUCCESS',
              executedAt: '2021-09-01T00:00:00Z',
            },
            {
              id: 'workflow1Execution2Id',
              state: 'PAUSED',
              executedAt: '2021-09-01T00:00:00Z',
            },
            {
              id: 'workflow1Execution3Id',
              state: 'ERROR',
              executedAt: '2021-09-01T00:00:00Z',
            },
          ],
          backup: TWorkflowBackup.LOCAL_AND_DISTANT,
          region: '',
          regions: ['region1', 'region2'],
        },
        {
          name: 'workflow2Name',
          id: 'workflow2Id',
          instanceId: 'workflow2InstanceId',
          instanceName: 'workflow2InstanceName',
          cron: 'workflow2Cron',
          lastExecution: '2021-09-01T00:00:00Z',
          lastExecutionStatus: 'SUCCESS',
          backupName: '',
          executions: null,
          backup: TWorkflowBackup.LOCAL,
          region: 'region',
          regions: ['region'],
        },
      ],
      pageCount: 2,
      totalRows: 2,
    },
  },
  project: {
    project_id: 'mocked_projectId',
  },
  workflow: {
    name: 'test',
    id: 'workflow1',
    instanceId: 'instanceId',
    instanceName: 'instanceName',
    cron: 'cron',
    lastExecution: 'lastExecution',
    lastExecutionStatus: 'SUCCESS',
    executions: [],
  },
};

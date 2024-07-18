import { renderHook } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { useWorkflowExecutions } from './useExecutions';
import * as useWorkflowHook from './workflows';

describe('useExecutions tests', () => {
  vi.spyOn(useWorkflowHook, 'useWorkflows').mockReturnValue({
    isPending: false,
    data: [
      {
        lastExecution: 'lastExecution',
        lastExecutionStatus: 'lastExecutionStatus',
        backupName: 'backupName',
        name: 'name',
        id: 'workflow_id',
        instanceId: 'instanceId',
        cron: 'cron',
        executions: [
          {
            id: 'project_id_1',
            state: 'SUCCESS',
            executedAt: '2024-07-18T01:05:29Z',
          },
          {
            id: 'project_id_2',
            state: 'SUCCESS',
            executedAt: '2024-07-17T01:05:24Z',
          },
        ],
      },
    ],
  });

  it('Should get mapped execution from a specific workflow', () => {
    const { result } = renderHook(
      () =>
        useWorkflowExecutions('projectId', 'workflow_id', {
          pagination: { pageIndex: 0, pageSize: 10 },
          sorting: { desc: false, id: 'id' },
        }),
      {
        wrapper,
      },
    );

    const {
      data: { executions },
    } = result.current;

    expect(executions.rows).toEqual([
      {
        id: 'project_id_1',
        state: 'SUCCESS',
        executedAt: '2024-07-18T01:05:29Z',
        executedAtDate: '18 juillet. 2024',
        executedAtTime: '03:05:29',
      },
      {
        id: 'project_id_2',
        state: 'SUCCESS',
        executedAt: '2024-07-17T01:05:24Z',
        executedAtDate: '17 juillet. 2024',
        executedAtTime: '03:05:24',
      },
    ]);
  });
});

import { describe, it } from 'vitest';

import { addLastExecution } from '@/api/data/mapper/workflow.mapper';
import { TRemoteWorkflow } from '@/api/data/region-workflow';
import { TWorkflowLastExecution } from '@/api/hooks/workflows';

describe('workflow mapper', () => {
  describe('addLastExecution', () => {
    const workflowWithNoExecution = {
      id: '1',
      executions: null,
    } as TRemoteWorkflow;

    const workflowWithEmptyExecutions = {
      id: '2',
      executions: [],
    } as TRemoteWorkflow;

    const workflowWithOneExecution = {
      id: '3',
      executions: [{ id: 'e1', executedAt: '2025-11-26T22:50:35Z', state: 'SUCCESS' }],
    } as TRemoteWorkflow;

    const workflowWithMultipleExecutions = {
      id: '4',
      executions: [
        { id: 'e1', executedAt: '2025-11-27T11:25:35Z', state: 'SUCCESS' },
        { id: 'e2', executedAt: '2025-11-26T22:50:35Z', state: 'ERROR' },
        { id: 'e3', executedAt: '2025-11-25T22:50:35Z', state: 'SUCCESS' },
        { id: 'e4', executedAt: '2025-11-27T22:50:35Z', state: 'PAUSED' },
      ],
    } as TRemoteWorkflow;

    it.each`
      workflow                          | expectedAddedResult
      ${workflowWithNoExecution}        | ${{ lastExecution: '', lastExecutionStatus: undefined }}
      ${workflowWithEmptyExecutions}    | ${{ lastExecution: '', lastExecutionStatus: undefined }}
      ${workflowWithOneExecution}       | ${{ lastExecution: '26 nov. 2025 22:50:35', lastExecutionStatus: 'SUCCESS' }}
      ${workflowWithMultipleExecutions} | ${{ lastExecution: '27 nov. 2025 22:50:35', lastExecutionStatus: 'PAUSED' }}
    `(
      'should add the last execution date to the workflow $workflow',
      ({
        workflow,
        expectedAddedResult,
      }: {
        workflow: TRemoteWorkflow;
        expectedAddedResult: TWorkflowLastExecution;
      }) => {
        const result = addLastExecution('fr')(workflow);

        expect(result).toEqual({ ...workflow, ...expectedAddedResult });
      },
    );
  });
});

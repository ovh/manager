import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import * as useExecutionsHook from '@/api/hooks/useExecutions';
import { wrapper } from '@/wrapperRenders';
import Executions from './Executions.page';

vi.mock('@ovhcloud/manager-components', async () => {
  const mod = await vi.importActual('@ovhcloud/manager-components');
  return {
    ...mod,
    useProject: () => ({
      iam: {
        id: '3456789',
        urn: 'urn',
      },
      access: 'full',
      status: 'ok',
      orderId: null,
      unleash: true,
      planCode: 'project.2018',
      expiration: null,
      project_id: 'project_id',
      description: 'A1CB2',
      manualQuota: false,
      projectName: '7799468455083292',
      creationDate: '2023-08-29T10:45:09.726577+02:00',
    }),
    useDatagridSearchParams: () => ({
      pagination: vi.fn(),
      setPagination: vi.fn(),
      sorting: vi.fn(),
      setSorting: vi.fn(),
    }),
    useProjectUrl: () => 'project_url',
  };
});

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
  useParams: () => ({ projectId: 'project_id', workflowId: 'workflow' }),
}));

describe('useExecutionDatagridColumns tests', () => {
  it('Should render spinner when isPending is true', () => {
    vi.spyOn(useExecutionsHook, 'useWorkflowExecutions').mockReturnValue({
      data: {
        executions: { rows: [], totalRows: 0, pageCount: 0 },
        workflowName: 'workflowName',
      },
      isPending: true,
    });

    const { getByTestId } = render(<Executions />, { wrapper });

    expect(getByTestId('Executions_spinner')).toBeVisible();
  });

  it('Should render not render spinner when isPending is false', () => {
    vi.spyOn(useExecutionsHook, 'useWorkflowExecutions').mockReturnValue({
      data: {
        executions: { rows: [], totalRows: 0, pageCount: 0 },
        workflowName: 'workflowName',
      },
      isPending: false,
    });

    const { queryByTestId } = render(<Executions />, { wrapper });

    expect(queryByTestId('Executions_spinner')).not.toBeInTheDocument();
  });

  it('Should render executions datagrid when isPending is false', () => {
    vi.spyOn(useExecutionsHook, 'useWorkflowExecutions').mockReturnValue({
      data: {
        executions: { rows: [], totalRows: 0, pageCount: 0 },
        workflowName: 'workflowName',
      },
      isPending: false,
    });

    const { getByTestId } = render(<Executions />, { wrapper });

    expect(getByTestId('Executions_datagrid-container')).toBeInTheDocument();
  });

  it('Should render Header when the workflowName is defined', () => {
    vi.spyOn(useExecutionsHook, 'useWorkflowExecutions').mockReturnValue({
      data: {
        executions: { rows: [], totalRows: 0, pageCount: 0 },
        workflowName: 'workflowName',
      },
      isPending: false,
    });

    const { getByTestId } = render(<Executions />, { wrapper });

    expect(getByTestId('Executions_header-container')).toBeInTheDocument();
  });
});

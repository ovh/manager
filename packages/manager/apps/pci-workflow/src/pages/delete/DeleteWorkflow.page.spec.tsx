import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import DeleteWorkflowPage from './DeleteWorkflow.page';
import * as workflowsModule from '@/api/hooks/workflows';
import * as instanceModule from '@/api/hooks/instance';
import { TInstance } from '@/type';
import { wrapper } from '@/wrapperRenders';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ projectId: 'project1', workflowId: 'workflow1' }),
}));

const mockUseNotifications = vi.fn();
vi.mock('@ovhcloud/manager-components', () => ({
  useNotifications: () => ({
    addError: mockUseNotifications,
    addSuccess: mockUseNotifications,
  }),
}));

type UseDeleteWorkflowReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { deleteWorkflow: () => void };

const mockDeleteWorkflow = vi.fn();
vi.spyOn(instanceModule, 'useInstance').mockReturnValue({
  data: { region: 'region1' },
} as UseQueryResult<TInstance>);

describe('DeleteWorkflowPage', () => {
  it('enables delete button only when DELETE is entered', async () => {
    vi.spyOn(workflowsModule, 'useWorkflows').mockReturnValue({
      isPending: false,
      data: [{ id: 'workflow1', name: 'Test Workflow' }] as never[],
    });
    vi.spyOn(workflowsModule, 'useDeleteWorkflow').mockReturnValue(({
      deleteWorkflow: mockDeleteWorkflow,
      isPending: false,
    } as unknown) as UseDeleteWorkflowReturnType);

    const { getByTestId } = render(<DeleteWorkflowPage />, { wrapper });

    const input = getByTestId('deleteWorkflow-input_delete');
    const deleteButton = getByTestId('deleteWorkflow-button_submit');

    expect(deleteButton).toBeDisabled();
    act(() => {
      fireEvent.change(input, { target: { value: 'DELETE' } });

      ((input as unknown) as OsdsInput).odsValueChange.emit({
        value: 'DELETE',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((input as unknown) as OsdsInput).value).toBe('DELETE');

    expect(deleteButton).not.toBeDisabled();
  });

  it('shows spinner and disabled delete button while delete operation is pending', async () => {
    vi.spyOn(workflowsModule, 'useWorkflows').mockReturnValue({
      isPending: false,
      data: [{ id: 'workflow1', name: 'Test Workflow' }] as never[],
    });
    vi.spyOn(workflowsModule, 'useDeleteWorkflow').mockReturnValue(({
      deleteWorkflow: mockDeleteWorkflow,
      isPending: true,
    } as unknown) as UseDeleteWorkflowReturnType);

    const { getByTestId } = render(<DeleteWorkflowPage />, { wrapper });

    expect(getByTestId('deleteWorkflow-spinner')).toBeInTheDocument();
  });

  it('shows spinner and disabled delete button while getting workflows  is pending', async () => {
    vi.spyOn(workflowsModule, 'useWorkflows').mockReturnValue({
      isPending: true,
      data: [],
    });
    vi.spyOn(workflowsModule, 'useDeleteWorkflow').mockReturnValue(({
      deleteWorkflow: mockDeleteWorkflow,
      isPending: false,
    } as unknown) as UseDeleteWorkflowReturnType);

    const { getByTestId } = render(<DeleteWorkflowPage />, { wrapper });

    expect(getByTestId('deleteWorkflow-spinner')).toBeInTheDocument();
  });

  it('calls deleteWorkflow function on delete button click', async () => {
    vi.spyOn(workflowsModule, 'useWorkflows').mockReturnValue({
      isPending: false,
      data: [{ id: 'workflow1', name: 'Test Workflow' }] as never[],
    });
    vi.spyOn(workflowsModule, 'useDeleteWorkflow').mockReturnValue(({
      deleteWorkflow: mockDeleteWorkflow,
      isPending: false,
    } as unknown) as UseDeleteWorkflowReturnType);

    const { getByTestId } = render(<DeleteWorkflowPage />, { wrapper });

    const input = getByTestId('deleteWorkflow-input_delete');
    const deleteButton = getByTestId('deleteWorkflow-button_submit');
    expect(deleteButton).toBeDisabled();
    act(() => {
      fireEvent.change(input, { target: { value: 'DELETE' } });

      ((input as unknown) as OsdsInput).odsValueChange.emit({
        value: 'DELETE',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((input as unknown) as OsdsInput).value).toBe('DELETE');
    act(() => {
      fireEvent.click(deleteButton);
    });
    expect(deleteButton).not.toBeDisabled();
    expect(mockDeleteWorkflow).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDeleteWorkflow } from './workflows';
import { deleteWorkflow } from '@/api/data/workflow';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/data/workflow');

describe('useDeleteWorkflow', () => {
  const onSuccessMock = vi.fn();
  const onErrorMock = vi.fn();

  it('calls onSuccess after successful deletion', async () => {
    vi.mocked(deleteWorkflow).mockResolvedValueOnce(undefined);
    const { result } = renderHook(
      () =>
        useDeleteWorkflow({
          projectId: 'project1',
          workflowId: 'workflow1',
          region: 'region1',
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      { wrapper },
    );

    act(() => result.current.deleteWorkflow());

    waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
    expect(onErrorMock).not.toHaveBeenCalled();
  });

  it('calls onError after failed deletion', async () => {
    const error = new Error('Deletion failed');
    vi.mocked(deleteWorkflow).mockRejectedValueOnce(error);
    const { result } = renderHook(
      () =>
        useDeleteWorkflow({
          projectId: 'project1',
          workflowId: 'workflow1',
          region: 'region1',
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      { wrapper },
    );

    act(() => result.current.deleteWorkflow());

    await waitFor(() => expect(onErrorMock).toHaveBeenCalled());
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});

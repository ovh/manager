import { renderHook } from '@testing-library/react-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTask } from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { useUpdateVrackServices } from './useUpdateVrackServices';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTask: vi.fn(),
}));

describe('useUpdateVrackServices Hook', () => {
  let queryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();

    vi.mocked(useTask).mockReturnValue({
      isSuccess: true,
      isPending: false,
      isError: false,
      error: undefined,
    });
    queryClient = {
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
    };
    vi.mocked(useQueryClient).mockReturnValue(queryClient);
  });

  it('should handle mutation success', async () => {
    const mockResponse = { data: { currentTasks: [{ id: 'task-id' }] } };
    const mockUpdateVs = vi.fn().mockImplementation((_, options) => {
      options?.onSuccess?.(mockResponse);
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockUpdateVs,
      mutateAsync: vi.fn().mockResolvedValue(mockResponse),
      data: null,
      variables: undefined,
      isIdle: true,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      status: 'idle',
      reset: () => {
        throw new Error('Function not implemented.');
      },
      context: undefined,
      failureCount: 0,
      failureReason: undefined,
      isPaused: false,
      submittedAt: 0,
    });

    const { result } = renderHook(() =>
      useUpdateVrackServices({
        id: 'test-id',
        onSuccess: vi.fn(),
        onError: vi.fn(),
      }),
    );

    expect(useTask).toHaveBeenCalledWith({
      apiVersion: 'v2',
      onError: expect.any(Function),
      onFinish: expect.any(Function),
      onSuccess: expect.any(Function),
      resourceUrl: '/vrackServices/resource/test-id',
      taskId: undefined,
    });

    expect(result.current).toStrictEqual({
      createEndpoint: expect.any(Function),
      createSubnet: expect.any(Function),
      deleteEndpoint: expect.any(Function),
      deleteSubnet: expect.any(Function),
      isError: false,
      isPending: false,
      isTaskSuccess: true,
      updateError: undefined,
      updateSubnet: expect.any(Function),
      updateVS: expect.any(Function),
    });
  });
});

import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useTask } from '@ovh-ux/manager-react-components';

import { useUpdateVrackServices } from './useUpdateVrackServices';

type UpdateVsResponse = { data: { currentTasks: { id: string }[] } };
type UpdateVsError = Error;
type UpdateVsVariables = unknown;
type UpdateVsContext = unknown;
interface UseTaskArgs {
  apiVersion: string;
  resourceUrl: string;
  taskId?: string;
  onError?: (err: Error) => void;
  onFinish?: () => void;
  onSuccess?: () => void;
}

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTask: vi.fn(),
}));

describe('useUpdateVrackServices Hook', () => {
  let queryClient: ReturnType<typeof useQueryClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();

    // mock useTask return
    vi.mocked(useTask).mockReturnValue({
      isSuccess: true,
      isPending: false,
      isError: false,
      error: {} as ApiError,
    });

    // mock queryClient
    queryClient = {
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
    } as unknown as ReturnType<typeof useQueryClient>;
    vi.mocked(useQueryClient).mockReturnValue(queryClient);
  });

  it('should handle mutation success', () => {
    const mockResponse: UpdateVsResponse = {
      data: { currentTasks: [{ id: 'task-id' }] },
    };

    // Typed mock for mutate
    const mockUpdateVs = vi.fn(
      (
        _vars: UpdateVsVariables,
        options?: UseMutationOptions<
          UpdateVsResponse,
          UpdateVsError,
          UpdateVsVariables,
          UpdateVsContext
        >,
      ) => {
        options?.onSuccess?.(mockResponse, _vars, undefined);
      },
    );

    // Typed mock mutation result
    const mockMutation: UseMutationResult<
      UpdateVsResponse,
      UpdateVsError,
      UpdateVsVariables,
      UpdateVsContext
    > = {
      mutate: mockUpdateVs,
      mutateAsync: vi.fn().mockResolvedValue(mockResponse),
      data: undefined,
      variables: undefined,
      isIdle: true,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      status: 'idle',
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: Date.now(),
    };

    vi.mocked(useMutation).mockReturnValue(mockMutation);

    const { result } = renderHook(() =>
      useUpdateVrackServices({
        id: 'test-id',
        onSuccess: vi.fn(),
        onError: vi.fn(),
      }),
    );

    // Assert useTask was called once
    expect(useTask).toHaveBeenCalledTimes(1);

    // capture the first argument of the first call
    const [[taskArgs]] = vi.mocked(useTask).mock.calls as [[UseTaskArgs]];

    // check scalar props
    expect(taskArgs.apiVersion).toBe('v2');
    expect(taskArgs.resourceUrl).toBe('/vrackServices/resource/test-id');
    expect(taskArgs.taskId).toBeUndefined();

    // check callbacks are functions
    expect(typeof taskArgs.onError).toBe('function');
    expect(typeof taskArgs.onFinish).toBe('function');
    expect(typeof taskArgs.onSuccess).toBe('function');

    // Assert hook result (scalars)
    expect(result.current.isError).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isTaskSuccess).toBe(true);
    expect(result.current.updateError).toBeUndefined();

    // Assert hook result (functions)
    expect(typeof result.current.createEndpoint).toBe('function');
    expect(typeof result.current.createSubnet).toBe('function');
    expect(typeof result.current.deleteEndpoint).toBe('function');
    expect(typeof result.current.deleteSubnet).toBe('function');
    expect(typeof result.current.updateSubnet).toBe('function');
    expect(typeof result.current.updateVS).toBe('function');
  });
});

import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useUpdateInstanceName, useInstance } from './useInstance';
import { updateInstanceName, getInstance } from '@/data/api/instance';
import queryClient from '@/queryClient';
import { TInstance } from '@/types/instance/entity.type';

const projectId = '8c8c4fd6d4414aa29fc777752b00005198664';
const instanceId = 'fake-id';
const region = 'fake-region';
const fakeInstance = { id: instanceId } as TInstance;
const editInstanceNameMock = vi.fn();

vi.mock('@/data/api/instance');
vi.mocked(getInstance).mockResolvedValue(fakeInstance);
vi.mocked(updateInstanceName).mockImplementation(editInstanceNameMock);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useInstance', () => {
  it('should return correctly Instance detail', async () => {
    const { result } = renderHook(() => useInstance({ region, instanceId }), {
      wrapper,
    });

    expect(getInstance).toHaveBeenCalledWith({
      projectId,
      instanceId,
      region,
    });
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(fakeInstance);
  });
});

describe('useUpdateInstanceName', () => {
  it('should updates instance name successfully when mutate', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    editInstanceNameMock.mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useUpdateInstanceName({
          projectId,
          instanceId,
          callbacks: {
            onSuccess: mockSuccess,
            onError: mockError,
          },
        }),
      { wrapper },
    );

    await act(async () =>
      result.current.mutate({ instanceName: 'new_instanceName' }),
    );

    expect(updateInstanceName).toHaveBeenCalled();
    expect(mockSuccess).toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
  });
});

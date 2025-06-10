import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useEditInstanceName } from './useInstance';
import { editInstanceName } from '@/data/api/instance';
import queryClient from '@/queryClient';

const projectId = 'projectId-test';
const instanceId = 'fake-id';
const editInstanceNameMock = vi.fn();

vi.mock('@/data/api/instance');

vi.mocked(editInstanceName).mockImplementation(editInstanceNameMock);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useEditInstanceName', () => {
  it('should updates instance name successfully when mutate', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    editInstanceNameMock.mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useEditInstanceName({
          projectId,
          instanceId,
          callbacks: {
            onSuccess: mockSuccess,
            onError: mockError,
          },
        }),
      { wrapper },
    );

    result.current.mutate({ instanceName: 'new_instanceName' });

    await waitFor(() => expect(editInstanceName).toHaveBeenCalled());
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });
});

import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, Mock, vi } from 'vitest';
import { useEditInstanceName, useRegionInstance } from './useInstance';
import { editInstanceName, getRegionInstance } from '@/data/api/instance';
import queryClient from '@/queryClient';
import { buildPartialInstanceDto } from './builder/instanceDto.builder';
import { TInstanceDetailDto } from '@/types/instance/api.type';

const projectId = 'projectId-test';
const instanceId = 'fake-id';
const region = 'fake-region';
const fakeInstanceDto = buildPartialInstanceDto<TInstanceDetailDto>({
  id: instanceId,
}).build();

const editInstanceNameMock = vi.fn();

vi.mock('@/data/api/instance');
vi.mocked(getRegionInstance as Mock).mockResolvedValue(fakeInstanceDto);
vi.mocked(editInstanceName).mockImplementation(editInstanceNameMock);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRegionInstance', () => {
  it('should return correctly Instance detail', async () => {
    const { result } = renderHook(
      () => useRegionInstance(projectId, instanceId, region),
      { wrapper },
    );

    expect(getRegionInstance).toHaveBeenCalledWith({
      projectId,
      instanceId,
      region,
    });
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(fakeInstanceDto);
  });
});

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

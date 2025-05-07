import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { instancesQueryKey } from '@/utils';
import { instanceDtoBuilder } from '@/__mocks__/instance/builder';
import { TInstanceDto } from '@/types/instance/api.type';
import { updateInstanceFromCache, useEditInstanceName } from './useInstance';
import { editInstanceName } from '@/data/api/instance';
import queryClient from '@/queryClient';

const projectId = 'projectId-test';
const instanceId = 'fake-id';
const fakeInstanceDto1: TInstanceDto = instanceDtoBuilder([], 'ACTIVE');
const editInstanceNameMock = vi.fn();

vi.mock('@/data/api/instance');

vi.mocked(editInstanceName).mockImplementation(editInstanceNameMock);

queryClient.setQueryData(
  instancesQueryKey(projectId, ['instance', instanceId]),
  fakeInstanceDto1,
);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useEditInstanceName', () => {
  it('should updates instance name successfully', async () => {
    editInstanceNameMock.mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useEditInstanceName({
          projectId,
          instanceId,
          callbacks: {
            onSuccess: (_data, { instanceName: name }) => {
              updateInstanceFromCache({
                projectId,
                instanceId,
                payload: { name },
              });
            },
          },
        }),
      { wrapper },
    );

    result.current.mutate({ instanceName: 'new_instanceName' });

    await waitFor(() => expect(editInstanceName).toHaveBeenCalled());
    expect(
      queryClient.getQueryData(
        instancesQueryKey(projectId, ['instance', instanceId]),
      ),
    ).toEqual({ ...fakeInstanceDto1, name: 'new_instanceName' });
  });
});

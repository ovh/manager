import { vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { v6 } from '@ovh-ux/manager-core-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToggleIAMAuthentication } from './useIAMAuthentication';
import { TRegistry } from '../data/registry';
import { getAllRegistriesQueryKey } from './useRegistry';

describe('Manage private registry IAM authentication', () => {
  const queryClient = new QueryClient();

  const onSuccess = vi.fn();
  const onError = vi.fn();

  const projectId = 'projectId';
  const registryId = 'registryId';

  const registryWithoutIam: Omit<TRegistry, 'iamEnabled'> = {
    createdAt: '2024-01-01',
    deliveredAt: '2024-01-02',
    id: registryId,
    name: 'Test Registry',
    notary_url: 'https://example.com/notary',
    region: 'GRA',
    size: 1024,
    status: 'READY',
    updatedAt: '2024-01-03',
    url: 'https://example.com/registry',
    version: '1.0',
    plan: {
      id: 'plan1',
      name: 'SMALL',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
      registryLimits: {
        imageStorage: 100,
        parallelRequest: 10,
      },
      features: {
        vulnerability: true,
      },
      code: 'PLAN_CODE',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should enable private registry IAM authentication', async () => {
    vi.mocked(v6.post).mockResolvedValue({ data: null });

    const mockedIAMDisabledRegistry: TRegistry[] = [
      { ...structuredClone(registryWithoutIam), iamEnabled: false },
    ];

    queryClient.setQueryData(
      getAllRegistriesQueryKey(projectId),
      mockedIAMDisabledRegistry,
    );

    const { result } = renderHook(
      () =>
        useToggleIAMAuthentication({ onSuccess, onError, action: 'ENABLE' }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await act(async () => {
      result.current.toggleIAMAuthentication({
        projectId,
        registryId,
        deleteUsers: true,
      });
    });

    await waitFor(() => {
      const registries = queryClient.getQueryData<TRegistry[]>(
        getAllRegistriesQueryKey(projectId),
      );
      const foundRegistry = registries?.find(
        (registry) => registry.id === registryId,
      );
      expect(foundRegistry).toBeDefined();
      expect(foundRegistry?.iamEnabled).toBe(true);
    });

    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `cloud/project/${projectId}/containerRegistry/${registryId}/iam`,
      { deleteUsers: true },
    );

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should disable registry IAM authentication', async () => {
    vi.mocked(v6.delete).mockResolvedValue({ data: null });

    const mockedIAMDisabledRegistry: TRegistry[] = [
      { ...structuredClone(registryWithoutIam), iamEnabled: true },
    ];

    const { result } = renderHook(
      () =>
        useToggleIAMAuthentication({ onSuccess, onError, action: 'DISABLE' }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    queryClient.setQueryData(
      getAllRegistriesQueryKey(projectId),
      mockedIAMDisabledRegistry,
    );

    await act(async () => {
      result.current.toggleIAMAuthentication({ projectId, registryId });
    });

    await waitFor(() => {
      const registries = queryClient.getQueryData<TRegistry[]>(
        getAllRegistriesQueryKey(projectId),
      );
      const foundRegistry = registries?.find(
        (registry) => registry.id === registryId,
      );
      expect(foundRegistry).toBeDefined();
      expect(foundRegistry?.iamEnabled).toBe(false);
    });

    expect(v6.delete).toHaveBeenCalledWith(
      `cloud/project/${projectId}/containerRegistry/${registryId}/iam`,
    );

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

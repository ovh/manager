import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as ApiKubernetesModule from '@/api/data/kubernetes';
import {
  useAllKube,
  useKubernetesCluster,
  useKubes,
  useRenameKubernetesCluster,
  useResetKubeConfig,
  useUpdateKubePolicy,
} from './useKubernetes';
import { wrapper } from '@/wrapperRenders';
import { TKube } from '@/types';

describe('useAllKube', () => {
  it('fetches all Kubernetes clusters successfully', async () => {
    const mockData = [{ id: 'kube1', name: 'Kube 1' }] as TKube[];
    vi.spyOn(ApiKubernetesModule, 'getAllKube').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useAllKube('project1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useKubes', () => {
  it('fetches filtered and paginated Kubernetes clusters successfully', async () => {
    const mockData = [
      { id: 'kube1', name: 'Kube 1', privateNetworkId: 'net1' },
    ] as TKube[];
    vi.spyOn(ApiKubernetesModule, 'getAllKube').mockResolvedValueOnce(mockData);
    const { result } = renderHook(
      () =>
        useKubes(
          'project1',
          {
            pageIndex: 1,
            pageSize: 10,
          },
          [],
        ),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.data).toEqual({
        rows: [],
        pageCount: 1,
        totalRows: 1,
      }),
    );
  });
});

describe('useKubernetesCluster', () => {
  it('fetches Kubernetes cluster details successfully', async () => {
    const mockData = { id: 'kube1', name: 'Kube 1', status: 'READY' } as TKube;
    vi.spyOn(ApiKubernetesModule, 'getKubernetesCluster').mockResolvedValueOnce(
      mockData,
    );
    const { result } = renderHook(
      () => useKubernetesCluster('project1', 'kube1'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ ...mockData, isClusterReady: true });
  });
  it('refetches data if the cluster is not ready', async () => {
    const projectId = 'project1';
    const kubeId = 'kube1';
    const refetchIntervalTime = 1000;
    const mockData = {
      id: 'kube1',
      name: 'Kube 1',
      status: 'NOT_READY',
    } as TKube;

    vi.spyOn(ApiKubernetesModule, 'getKubernetesCluster').mockResolvedValue(
      mockData,
    );

    const { result } = renderHook(
      () => useKubernetesCluster(projectId, kubeId, refetchIntervalTime),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    vi.useFakeTimers({ shouldAdvanceTime: true });

    await waitFor(() =>
      expect(ApiKubernetesModule.getKubernetesCluster).toHaveBeenCalledTimes(2),
    );
  });
  it('does not refetch data if the cluster is ready', async () => {
    const projectId = 'project1';
    const kubeId = 'kube1';
    const refetchIntervalTime = 1000;
    const mockData = { id: 'kube1', name: 'Kube 1', status: 'READY' } as TKube;

    vi.spyOn(ApiKubernetesModule, 'getKubernetesCluster').mockResolvedValue(
      mockData,
    );

    const { result } = renderHook(
      () => useKubernetesCluster(projectId, kubeId, refetchIntervalTime),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await waitFor(() =>
      expect(ApiKubernetesModule.getKubernetesCluster).toHaveBeenCalledTimes(1),
    );
  });
});

describe('useRenameKubernetesCluster', () => {
  it('renames Kubernetes cluster successfully', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    vi.spyOn(
      ApiKubernetesModule,
      'updateKubernetesCluster',
    ).mockResolvedValueOnce({});
    const { result } = renderHook(
      () =>
        useRenameKubernetesCluster({
          projectId: 'project1',
          kubeId: 'kube1',
          name: 'New Name',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    result.current.renameCluster();
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });
});

describe('useResetKubeConfig', () => {
  it('resets Kubernetes config successfully', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    vi.spyOn(ApiKubernetesModule, 'resetKubeConfig').mockResolvedValueOnce({});
    const { result } = renderHook(
      () =>
        useResetKubeConfig({
          projectId: 'project1',
          kubeId: 'kube1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    result.current.resetKubeConfig();
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });
});

describe('useUpdateKubePolicy', () => {
  it('updates Kubernetes policy successfully', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    vi.spyOn(ApiKubernetesModule, 'updateKubePolicy').mockResolvedValueOnce({});
    const { result } = renderHook(
      () =>
        useUpdateKubePolicy({
          projectId: 'project1',
          kubeId: 'kube1',
          updatePolicy: 'newPolicy',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    result.current.updateKubePolicy();
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });
});

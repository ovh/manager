import { renderHook, waitFor } from '@testing-library/react';
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
    const mockData = {
      id: 'kube1',
      name: 'Kube 1',
      status: 'READY',
      customization: {
        apiServer: {
          admissionPlugins: {
            enabled: ['NodeRestriction'],
            disabled: ['AlwaysPullImages', 'No_referenced'],
          },
        },
      },
    } as TKube;
    vi.spyOn(ApiKubernetesModule, 'getKubernetesCluster').mockResolvedValueOnce(
      mockData,
    );
    const { result } = renderHook(
      () => useKubernetesCluster('project1', 'kube1'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      ...mockData,
      isClusterReady: true,
      plugins: [
        {
          name: 'NodeRestriction',
          value: 'node',
          state: 'enabled',
          disabled: true,
          label: 'Plugin Node Restriction',
          tip:
            'kube_service_cluster_admission_plugins_node_restriction_explanation',
        },
        {
          name: 'AlwaysPullImages',
          value: 'pull',
          disabled: false,
          label: 'Plugin Always Pull Images',
          state: 'disabled',
          tip:
            'kube_service_cluster_admission_plugins_always_pull_image_explanation',
        },

        {
          name: 'No_referenced',
          value: 'No_referenced',
          state: 'disabled',
          disabled: false,
          label: 'No_referenced',
          tip: null,
        },
      ],
    });
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

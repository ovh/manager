import {
  fetchIcebergV6,
  IcebergFetchResultV6,
  v6,
} from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import * as ApiKubernetesModule from '@/api/data/kubernetes';
import {
  addOidcProvider,
  createSubscription,
  deleteSubscription,
  getAllKube,
  getClusterRestrictions,
  getKubernetesCluster,
  getOidcProvider,
  getSubscribedLogs,
  pollOperation,
  postKubeConfig,
  postLogURL,
  removeOidcProvider,
  resetKubeConfig,
  terminateCluster,
  TOidcProvider,
  updateKubePolicy,
  updateKubernetesCluster,
  updateKubeVersion,
  updateOidcProvider,
} from '@/api/data/kubernetes';
import { TKube } from '@/types';

describe('getKubernetesCluster', () => {
  it('fetches kubernetes cluster successfully', async () => {
    const mockData = { id: 'kube1', name: 'Kube Cluster 1' } as TKube;
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getKubernetesCluster('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching kubernetes cluster', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getKubernetesCluster('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('getAllKube', () => {
  it('fetches all kubernetes clusters successfully', async () => {
    const mockData = [
      { id: 'kube1', name: 'Kube Cluster 1' },
      { id: 'kube2', name: 'Kube Cluster 2' },
    ] as TKube[];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getAllKube('project1');
    expect(result).toEqual(mockData);
  });

  it('handles empty kubernetes clusters response', async () => {
    const mockData = [] as TKube[];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getAllKube('project1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching all kubernetes clusters', async () => {
    vi.mocked(fetchIcebergV6).mockRejectedValue(new Error('Network Error'));
    await expect(getAllKube('project1')).rejects.toThrow('Network Error');
  });
});

describe('updateKubernetesCluster', () => {
  it('updates kubernetes cluster successfully', async () => {
    const mockData = { id: 'kube1', name: 'Updated Kube Cluster' } as TKube;
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });
    const result = await updateKubernetesCluster('project1', 'kube1', {
      name: 'Updated Kube Cluster',
    });
    expect(result).toEqual(mockData);
  });

  it('handles error when updating kubernetes cluster', async () => {
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));
    await expect(
      updateKubernetesCluster('project1', 'kube1', {
        name: 'Updated Kube Cluster',
      }),
    ).rejects.toThrow('Network Error');
  });
});

describe('resetKubeConfig', () => {
  it('resets kube config successfully', async () => {
    const mockData = { content: 'new kube config' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    const result = await resetKubeConfig('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when resetting kube config', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(resetKubeConfig('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('getClusterRestrictions', () => {
  it('fetches cluster restrictions successfully', async () => {
    const mockData = ['restriction1', 'restriction2'];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getClusterRestrictions('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching cluster restrictions', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getClusterRestrictions('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('getOidcProvider', () => {
  it('fetches OIDC provider successfully', async () => {
    const mockData = {
      issuerUrl: 'https://issuer.url',
      clientId: 'client-id',
      usernameClaim: 'username',
      usernamePrefix: 'prefix',
      groupsClaim: null,
      groupsPrefix: 'groups-prefix',
      signingAlgorithms: null,
      caContent: 'ca-content',
      requiredClaim: null,
    } as TOidcProvider;
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getOidcProvider('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching OIDC provider', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getOidcProvider('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('terminateCluster', () => {
  it('terminates cluster successfully', async () => {
    const mockData = {};
    vi.mocked(v6.delete).mockResolvedValue({ data: mockData });
    const result = await terminateCluster('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when terminating cluster', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(terminateCluster('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('updateKubeVersion', () => {
  it('updates kube version successfully', async () => {
    const mockData = { status: 'success' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    const result = await updateKubeVersion('project1', 'kube1', 'rolling');
    expect(result).toEqual(mockData);
  });

  it('handles error when updating kube version', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(
      updateKubeVersion('project1', 'kube1', 'rolling'),
    ).rejects.toThrow('Network Error');
  });
});

describe('updateKubePolicy', () => {
  it('updates kube policy successfully', async () => {
    const mockData = { status: 'success' };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });
    const result = await updateKubePolicy('project1', 'kube1', 'rolling');
    expect(result).toEqual(mockData);
  });

  it('handles error when updating kube policy', async () => {
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));
    await expect(
      updateKubePolicy('project1', 'kube1', 'rolling'),
    ).rejects.toThrow('Network Error');
  });
});

describe('postKubeConfig', () => {
  it('posts kube config successfully', async () => {
    const mockData = { content: 'new kube config' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    const result = await postKubeConfig('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when posting kube config', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(postKubeConfig('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('addOidcProvider', () => {
  it('adds OIDC provider successfully', async () => {
    const mockData = {
      issuerUrl: 'https://issuer.url',
      clientId: 'client-id',
      usernameClaim: 'username',
      usernamePrefix: 'prefix',
      groupsClaim: null,
      groupsPrefix: 'groups-prefix',
      signingAlgorithms: null,
      caContent: 'ca-content',
      requiredClaim: null,
    };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    const result = await addOidcProvider('project1', 'kube1', mockData);
    expect(result).toEqual(mockData);
  });

  it('handles error when adding OIDC provider', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(
      addOidcProvider('project1', 'kube1', {} as TOidcProvider),
    ).rejects.toThrow('Network Error');
  });
});

describe('updateOidcProvider', () => {
  it('updates OIDC provider successfully', async () => {
    const mockData = {
      issuerUrl: 'https://issuer.url',
      clientId: 'client-id',
      usernameClaim: 'username',
      usernamePrefix: 'prefix',
      groupsClaim: null,
      groupsPrefix: 'groups-prefix',
      signingAlgorithms: null,
      caContent: 'ca-content',
      requiredClaim: null,
    };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });
    const result = await updateOidcProvider('project1', 'kube1', mockData);
    expect(result).toEqual(mockData);
  });

  it('handles error when updating OIDC provider', async () => {
    vi.mocked(v6.put).mockRejectedValue(new Error('Network Error'));
    await expect(
      updateOidcProvider('project1', 'kube1', {} as TOidcProvider),
    ).rejects.toThrow('Network Error');
  });
});

describe('removeOidcProvider', () => {
  it('removes OIDC provider successfully', async () => {
    const mockData = {};
    vi.mocked(v6.delete).mockResolvedValue({ data: mockData });
    const result = await removeOidcProvider('project1', 'kube1');
    expect(result).toEqual(mockData);
  });

  it('handles error when removing OIDC provider', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(removeOidcProvider('project1', 'kube1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('getSubscribedLogs', () => {
  it('fetches subscribed logs successfully', async () => {
    const mockData = [
      {
        createdAt: '2023-01-01T00:00:00Z',
        king: 'log',
        resource: { name: 'resource1', type: 'type1' },
        serviceName: 'service1',
        streamId: 'stream1',
        subscriptionId: 'sub1',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getSubscribedLogs('project1', 'kube1', 'audit');
    expect(result).toEqual(mockData);
  });

  it('handles empty subscribed logs response', async () => {
    const mockData = [];
    vi.mocked(fetchIcebergV6).mockResolvedValue({
      data: mockData,
    } as IcebergFetchResultV6<unknown>);
    const result = await getSubscribedLogs('project1', 'kube1', 'audit');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching subscribed logs', async () => {
    vi.mocked(fetchIcebergV6).mockRejectedValue(new Error('Network Error'));
    await expect(
      getSubscribedLogs('project1', 'kube1', 'audit'),
    ).rejects.toThrow('Network Error');
  });
});

describe('postLogURL', () => {
  it('posts log URL successfully', async () => {
    const mockData = {
      expirationDate: '2023-12-31T23:59:59Z',
      url: 'https://log.url',
    };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    const result = await postLogURL('project1', 'kube1', 'audit');
    expect(result).toEqual(mockData);
  });

  it('handles error when posting log URL', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(postLogURL('project1', 'kube1', 'audit')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('createSubscription', () => {
  // TODO fix this test
  it.skip('creates subscription successfully', async () => {
    const mockOperation = { operationId: 'op1', serviceName: 'service1' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockOperation });
    vi.spyOn(ApiKubernetesModule, 'pollOperation').mockResolvedValue(
      mockOperation,
    );
    const result = await createSubscription(
      'project1',
      'kube1',
      'stream1',
      'audit',
    );
    expect(result).toEqual(mockOperation);
  });

  it('handles error when creating subscription', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));
    await expect(
      createSubscription('project1', 'kube1', 'stream1', 'audit'),
    ).rejects.toThrow('Network Error');
  });
});

describe('pollOperation', () => {
  it('returns operation data when state is SUCCESS', async () => {
    const mockOperation = { state: 'SUCCESS' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockOperation });
    const result = await pollOperation('service1', 'op1');
    expect(result).toBeTruthy();
  });

  // TODO fix this test
  it.skip('throws error when state is ERROR', async () => {
    const mockOperation = 'ERROR';
    vi.mocked(v6.get).mockResolvedValue({ data: mockOperation });
    await expect(pollOperation('service1', 'op1')).rejects.toThrow(
      'Error: Network Error',
    );
  });

  it('polls until state is SUCCESS', async () => {
    const mockOperationPending = { state: 'PENDING' };
    const mockOperationSuccess = { state: 'SUCCESS' };
    vi.mocked(v6.get)
      .mockResolvedValueOnce({ data: mockOperationPending })
      .mockResolvedValueOnce({ data: mockOperationSuccess });
    const result = await pollOperation('service1', 'op1');
    expect(result).toBeTruthy();
  });

  // TODO fix this test
  it.skip('throws error when polling fails', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(pollOperation('service1', 'op1')).rejects.toThrow(
      'Network Error',
    );
  });
});

describe('deleteSubscription', () => {
  // TODO fix this test
  it.skip('deletes subscription successfully', async () => {
    const mockOperation = { operationId: 'op1', serviceName: 'service1' };
    vi.mocked(v6.delete).mockResolvedValue({ data: mockOperation });
    vi.mocked(pollOperation).mockResolvedValue(mockOperation);
    const result = await deleteSubscription('project1', 'kube1', 'sub1');
    expect(result).toBeTruthy();
  });

  it('handles error when deleting subscription', async () => {
    vi.mocked(v6.delete).mockRejectedValue(new Error('Network Error'));
    await expect(
      deleteSubscription('project1', 'kube1', 'sub1'),
    ).rejects.toThrow('Network Error');
  });
});

describe('updateAdmissionPlugin', () => {
  it('calls v6.put with the correct parameters', async () => {
    const projectId = 'project-id';
    const kubeId = 'kube-id';
    const customization = {
      apiServer: { admissionPlugins: { enabled: [], disabled: [] } },
    };

    const expectedUrl = `/cloud/project/${projectId}/kube/${kubeId}/customization`;
    vi.mocked(v6.put).mockResolvedValue({ customization });
    await ApiKubernetesModule.updateAdmissionPlugin({
      projectId,
      kubeId,
      customization,
    });

    expect(v6.put).toHaveBeenCalledWith(expectedUrl, customization);
  });
});

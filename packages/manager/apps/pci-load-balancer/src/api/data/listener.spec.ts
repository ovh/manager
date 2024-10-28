import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createListener,
  CreateListenerProps,
  deleteListener,
  editListener,
  EditListenerProps,
  getListener,
  getLoadBalancerListeners,
} from './listener';
import { mockLoadBalancerListeners } from '@/mocks';

const projectId = 'test-project';
const region = 'test-region';
const listenerId = 'test-listener';
const loadBalancerId = 'loadBalancerId';

describe('deleteListener', () => {
  it('should delete a listener and return data', async () => {
    const mockResponse = { success: true };
    vi.mocked(v6.delete).mockResolvedValueOnce({ data: mockResponse });

    const result = await deleteListener(projectId, region, listenerId);

    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('getListener', () => {
  it('should get a listener and return data', async () => {
    const mockListener = { id: listenerId, name: 'test-listener' };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockListener });

    const result = await getListener(projectId, region, listenerId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
    );
    expect(result).toEqual(mockListener);
  });
});
describe('getLoadBalancerListeners', () => {
  vi.mocked(v6.get).mockResolvedValue({ data: mockLoadBalancerListeners });

  it('should fetch load balancer for getLoadBalancerListeners success', async () => {
    const result = await getLoadBalancerListeners(
      projectId,
      region,
      loadBalancerId,
    );
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener?loadbalancerId=${loadBalancerId}`,
    );
    expect(result).toEqual(mockLoadBalancerListeners);
  });

  it('should handle errors getLoadBalancerListeners', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(
      getLoadBalancerListeners(projectId, region, loadBalancerId),
    ).rejects.toThrow(errorMessage);
  });
});
describe('createListener', () => {
  beforeEach(() => {
    vi.mocked(v6.post).mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new listener', async () => {
    const listenerProps = {
      projectId,
      region,
      loadBalancerId,
      name: 'listenerName',
      protocol: 'http',
      port: 80,
      defaultPoolId: 'defaultPoolId',
      onSuccess: vi.fn(),
      onError: vi.fn(),
    } as CreateListenerProps;
    await createListener(listenerProps);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener`,
      {
        loadbalancerId: loadBalancerId,
        name: 'listenerName',
        protocol: 'http',
        port: 80,
        defaultPoolId: 'defaultPoolId',
      },
    );
  });

  it('should handle errors createListener', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.post).mockRejectedValue(new Error(errorMessage));

    await expect(
      createListener({
        projectId,
        region,
        loadBalancerId,
        name: 'listenerName',
        protocol: 'http',
        port: 80,
      }),
    ).rejects.toThrow(errorMessage);
  });
});

describe('editListener', () => {
  beforeEach(() => {
    vi.mocked(v6.put).mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should edit an existing listener', async () => {
    const listenerProps = {
      projectId,
      region,
      name: 'newListenerName',
      defaultPoolId: 'newDefaultPoolId',
      listenerId: 'listenerId',
    } as EditListenerProps;
    await editListener(listenerProps);
    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerProps.listenerId}`,
      {
        name: 'newListenerName',
        defaultPoolId: 'newDefaultPoolId',
      },
    );
  });

  it('should handle errors editListener', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.put).mockRejectedValue(new Error(errorMessage));

    await expect(
      editListener({
        projectId,
        region,
        listenerId: 'listenerId',
        name: 'newListenerName',
      }),
    ).rejects.toThrow(errorMessage);
  });
});

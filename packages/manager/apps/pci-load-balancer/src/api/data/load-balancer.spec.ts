import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  getLoadBalancer,
  getLoadBalancers,
  getLoadBalancerFlavor,
  TLoadBalancerResponse,
  deleteLoadBalancer,
  getLoadBalancerListeners,
  updateLoadBalancerName,
  createListener,
  CreateListenerProps,
  editListener,
  EditListenerProps,
} from './load-balancer';
import {
  mockFlavor,
  mockLoadBalancer,
  mockLoadBalancerListeners,
  mockLoadBalancers,
} from '@/mocks';

const projectId = 'test-project-id';
const region = 'region1';
const loadBalancerId = 'loadBalancerId';
const flavorId = 'flavorId';

describe('getLoadBalancers', () => {
  const mockResponse: TLoadBalancerResponse = {
    resources: mockLoadBalancers,
    errors: [],
  };

  beforeEach(() => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancers for the given project ID', async () => {
    const result = await getLoadBalancers(projectId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/aggregated/loadbalancer`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(getLoadBalancers(projectId)).rejects.toThrow(errorMessage);
  });
});

describe('getLoadBalancer', () => {
  beforeEach(() => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockLoadBalancer });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancer for the given project ID, region and balancer id', async () => {
    const result = await getLoadBalancer(projectId, region, loadBalancerId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadBalancerId}`,
    );
    expect(result).toEqual(mockLoadBalancer);
  });

  it('should handle errors getLoadBalancer', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(
      getLoadBalancer(projectId, region, loadBalancerId),
    ).rejects.toThrow(errorMessage);
  });
});

describe('getLoadBalancerFlavor', () => {
  beforeEach(() => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockFlavor });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancer for getLoadBalancerFlavor success', async () => {
    const result = await getLoadBalancerFlavor(projectId, region, flavorId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/flavor/${flavorId}`,
    );
    expect(result).toEqual(mockFlavor);
  });

  it('should handle errors getLoadBalancerFlavor', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(
      getLoadBalancerFlavor(projectId, region, flavorId),
    ).rejects.toThrow(errorMessage);
  });
});

describe('deleteLoadBalancer', () => {
  beforeEach(() => {
    vi.mocked(v6.delete).mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancer for deleteLoadBalancer success', async () => {
    await deleteLoadBalancer(projectId, mockLoadBalancer);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${mockLoadBalancer.region}/loadbalancing/loadbalancer/${mockLoadBalancer.id}`,
    );
  });

  it('should handle errors deleteLoadBalancer', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.delete).mockRejectedValue(new Error(errorMessage));

    await expect(
      deleteLoadBalancer(projectId, mockLoadBalancer),
    ).rejects.toThrow(errorMessage);
  });
});

describe('getLoadBalancerListeners', () => {
  beforeEach(() => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockLoadBalancerListeners });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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

describe('updateLoadBalancerName', () => {
  beforeEach(() => {
    vi.mocked(v6.put).mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancer for updateLoadBalancerName success', async () => {
    await updateLoadBalancerName(projectId, mockLoadBalancer, 'newName');
    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${mockLoadBalancer.region}/loadbalancing/loadbalancer/${mockLoadBalancer.id}`,
      { name: 'newName' },
    );
  });

  it('should handle errors updateLoadBalancerName', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.put).mockRejectedValue(new Error(errorMessage));

    await expect(
      updateLoadBalancerName(projectId, mockLoadBalancer, 'newName'),
    ).rejects.toThrow(errorMessage);
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
});

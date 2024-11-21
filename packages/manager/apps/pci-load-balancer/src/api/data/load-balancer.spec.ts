import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  getLoadBalancer,
  getLoadBalancers,
  getLoadBalancerFlavor,
  TLoadBalancerResponse,
  deleteLoadBalancer,
  updateLoadBalancerName,
  createLoadBalancer,
  TCreateLoadBalancerParam,
} from './load-balancer';
import { mockFlavor, mockLoadBalancer, mockLoadBalancers } from '@/mocks';

export const projectId = 'test-project-id';
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

describe('updateLoadBalancerName', () => {
  beforeEach(() => {
    vi.mocked(v6.put).mockResolvedValue({ data: {} });
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

  describe('createLoadBalancer', () => {
    beforeEach(() => {
      vi.mocked(v6.post).mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should create a new load balancer', async () => {
      const createLoadBalancerParams = {
        projectId,
        flavor: { id: 'flavorId', name: 'flavorName', region: 'region1' },
        region: { name: 'region1' },
        floatingIp: { type: 'create', id: 'floatingIpId' },
        privateNetwork: { id: 'privateNetworkId' },
        subnet: { id: 'subnetId' },
        gateways: [{ id: 'gatewayId' }],
        listeners: [
          {
            protocol: 'http',
            port: 80,
            instances: [
              { instance: { ipAddresses: [{ ip: '127.0.0.1' }] }, port: 80 },
            ],
            healthMonitor: 'http',
          },
        ],
        name: 'loadBalancerName',
      } as TCreateLoadBalancerParam;

      await createLoadBalancer(createLoadBalancerParams);

      expect(v6.post).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/region1/loadbalancing/loadbalancer`,
        {
          flavorId: 'flavorId',
          network: {
            private: {
              network: {
                id: 'privateNetworkId',
                subnetId: 'subnetId',
              },
              floatingIpCreate: {
                description:
                  'FIP created by OVHCloud Control Panel (Manager) for Load Balancer loadBalancerName',
              },
              gateway: {
                id: 'gatewayId',
              },
            },
          },
          name: 'loadBalancerName',
          listeners: [
            {
              port: 80,
              protocol: 'http',
              pool: {
                algorithm: 'roundRobin',
                protocol: 'http',
                healthMonitor: {
                  name: 'health-monitor-http',
                  monitorType: 'http',
                  maxRetries: 4,
                  delay: 5,
                  timeout: 4,
                  httpConfiguration: {
                    httpMethod: 'GET',
                    urlPath: '/',
                  },
                },
                members: [
                  {
                    address: '127.0.0.1',
                    protocolPort: 80,
                  },
                ],
              },
            },
          ],
        },
      );
    });

    it('should handle errors createLoadBalancer', async () => {
      const errorMessage = 'Network Error';
      vi.mocked(v6.post).mockRejectedValue(new Error(errorMessage));

      await expect(
        createLoadBalancer({
          projectId,
          flavor: { id: 'flavorId', name: 'flavorName', region: 'region1' },
          region: { name: 'region1' },
          floatingIp: { type: 'create', id: 'floatingIpId' },
          privateNetwork: { id: 'privateNetworkId' },
          subnet: { id: 'subnetId' },
          gateways: [{ id: 'gatewayId' }],
          listeners: [],
          name: 'loadBalancerName',
        } as TCreateLoadBalancerParam),
      ).rejects.toThrow(errorMessage);
    });
  });
});

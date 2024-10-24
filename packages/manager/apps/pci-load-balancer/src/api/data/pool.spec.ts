import { v6 } from '@ovh-ux/manager-core-api';
import { vi } from 'vitest';
import {
  getLoadBalancerPools,
  deletePool,
  createPool,
  updatePool,
  getPool,
  TLoadBalancerPool,
  TCreatePoolParam,
  TUpdatePoolParam,
} from './pool';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from './load-balancer';

describe('Load Balancer Pool API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const loadBalancerId = 'test-loadbalancer';
  const poolId = 'test-pool';
  const poolData: TLoadBalancerPool = {
    id: 'test-pool',
    name: 'test-pool',
    protocol: 'http',
    algorithm: 'ROUND_ROBIN',
    operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
    provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
    sessionPersistence: {
      type: 'HTTP_COOKIE',
      cookieName: 'test-cookie',
    },
    loadbalancerId: 'test-loadbalancer',
    listenerId: 'test-listener',
  };

  it('should fetch load balancer pools', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: [poolData] });

    const result = await getLoadBalancerPools(
      projectId,
      region,
      loadBalancerId,
    );

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool?loadbalancerId=${loadBalancerId}`,
    );
    expect(result).toEqual([poolData]);
  });

  it('should delete a pool', async () => {
    vi.mocked(v6.delete).mockResolvedValue({ data: {} });

    const result = await deletePool(projectId, region, poolId);

    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
    );
    expect(result).toEqual({});
  });

  it('should create a pool', async () => {
    const createPoolParam: TCreatePoolParam = {
      projectId,
      region,
      loadbalancerId: loadBalancerId,
      name: 'test-pool',
      algorithm: 'ROUND_ROBIN',
      protocol: 'HTTP',
      permanentSession: {
        isEnabled: true,
        type: 'HTTP_COOKIE',
        cookieName: 'test-cookie',
      },
    };

    vi.mocked(v6.post).mockResolvedValue({ data: poolData });

    const result = await createPool(createPoolParam);

    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool`,
      {
        loadbalancerId: loadBalancerId,
        name: 'test-pool',
        algorithm: 'ROUND_ROBIN',
        protocol: 'HTTP',
        sessionPersistence: {
          type: 'HTTP_COOKIE',
          cookieName: 'test-cookie',
        },
      },
    );
    expect(result).toEqual(poolData);
  });

  it('should create a pool without sessionPersistence', async () => {
    const createPoolParam: TCreatePoolParam = {
      projectId,
      region,
      loadbalancerId: loadBalancerId,
      name: 'test-pool',
      algorithm: 'ROUND_ROBIN',
      protocol: 'HTTP',
      permanentSession: {
        isEnabled: false,
        type: 'HTTP_COOKIE',
        cookieName: 'test-cookie',
      },
    };

    vi.mocked(v6.post).mockResolvedValue({ data: poolData });

    const result = await createPool(createPoolParam);

    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool`,
      {
        loadbalancerId: loadBalancerId,
        name: 'test-pool',
        algorithm: 'ROUND_ROBIN',
        protocol: 'HTTP',
        sessionPersistence: null,
      },
    );
    expect(result).toEqual(poolData);
  });

  it('should update a pool', async () => {
    const updatePoolParam: TUpdatePoolParam = {
      projectId,
      region,
      poolId,
      name: 'updated-pool',
      algorithm: 'LEAST_CONNECTIONS',
      permanentSession: {
        isEnabled: true,
        type: 'SOURCE_IP',
        cookieName: 'updated-cookie',
      },
    };

    vi.mocked(v6.put).mockResolvedValue({ data: poolData });

    const result = await updatePool(updatePoolParam);

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
      {
        name: 'updated-pool',
        algorithm: 'LEAST_CONNECTIONS',
        sessionPersistence: {
          type: 'SOURCE_IP',
          cookieName: 'updated-cookie',
        },
      },
    );
    expect(result).toEqual(poolData);
  });

  it('should update a pool without session', async () => {
    const updatePoolParam: TUpdatePoolParam = {
      projectId,
      region,
      poolId,
      name: 'updated-pool',
      algorithm: 'LEAST_CONNECTIONS',
      permanentSession: {
        isEnabled: false,
        type: 'SOURCE_IP',
        cookieName: 'updated-cookie',
      },
    };

    vi.mocked(v6.put).mockResolvedValue({ data: poolData });

    const result = await updatePool(updatePoolParam);

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
      {
        name: 'updated-pool',
        algorithm: 'LEAST_CONNECTIONS',
        sessionPersistence: { type: 'disabled' },
      },
    );
    expect(result).toEqual(poolData);
  });

  it('should fetch a single pool', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: poolData });

    const result = await getPool(projectId, region, poolId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
    );
    expect(result).toEqual(poolData);
  });
});

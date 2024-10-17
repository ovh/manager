import { v6 } from '@ovh-ux/manager-core-api';
import {
  getPoolMembers,
  deletePoolMember,
  getPoolMember,
  updatePoolMemberName,
  createPoolMembers,
  TPoolMember,
} from './pool-member';
import {
  LoadBalancerProvisioningStatusEnum,
  LoadBalancerOperatingStatusEnum,
} from './load-balancer';

describe('Pool Member API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const poolId = 'test-pool';
  const memberId = 'test-member';
  const mockPoolMember: TPoolMember = {
    id: 'test-id',
    name: 'test-name',
    operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
    provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
    address: '127.0.0.1',
    protocolPort: 80,
    weight: 1,
  };

  it('should get pool members', async () => {
    const mockData = [mockPoolMember];
    (v6.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await getPoolMembers(projectId, region, poolId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
    );
    expect(result).toEqual(mockData);
  });

  it('should delete a pool member', async () => {
    const mockData = { success: true };
    (v6.delete as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await deletePoolMember(projectId, region, poolId, memberId);

    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
    );
    expect(result).toEqual(mockData);
  });

  it('should get a pool member', async () => {
    (v6.get as jest.Mock).mockResolvedValue({ data: mockPoolMember });

    const result = await getPoolMember(projectId, region, poolId, memberId);

    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
    );
    expect(result).toEqual(mockPoolMember);
  });

  it('should update a pool member name', async () => {
    const newName = 'new-name';
    const mockData = { success: true };
    (v6.put as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await updatePoolMemberName(
      projectId,
      region,
      poolId,
      memberId,
      newName,
    );

    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
      { name: newName },
    );
    expect(result).toEqual(mockData);
  });

  it('should create pool members', async () => {
    const mockData = { success: true };
    const members = [mockPoolMember];
    (v6.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await createPoolMembers(projectId, region, poolId, members);

    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
      { members },
    );
    expect(result).toEqual(mockData);
  });
});

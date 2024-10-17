import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetSubnetGateways } from './useGateways';
import { getSubnetGateways, TSubnetGateway } from '@/api/data/gateways';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/data/gateways');
describe('useGetSubnetGateways', () => {
  const projectId = 'test-project';
  const regionName = 'test-region';
  const subnetId = 'test-subnet';

  it('should fetch subnet gateways successfully', async () => {
    const mockData = [
      { id: 'gateway-1' },
      { id: 'gateway-2' },
    ] as TSubnetGateway[];
    vi.mocked(getSubnetGateways).mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () => useGetSubnetGateways(projectId, regionName, subnetId),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(getSubnetGateways).toHaveBeenCalledWith(
      projectId,
      regionName,
      subnetId,
    );
  });
});

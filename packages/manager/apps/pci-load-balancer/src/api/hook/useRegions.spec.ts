import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { useGetRegions } from './useRegions';
import { useGetPlans } from '@/api/hook/usePlans';
import { useGetPrivateNetworks } from '@/api/hook/useNetwork';
import { TPrivateNetwork } from '../data/network';
import { TPlanResponse } from '../data/plans';

vi.mock('@/api/hook/usePlans');
vi.mock('@/api/hook/useNetwork');

describe('useGetRegions', () => {
  const projectId = 'test-project-id';

  it('should return regions data when plans and networks are available', async () => {
    const sizeFlavor = 's';
    const plansResponse = {
      plans: [
        {
          code: `octavia-loadbalancer.loadbalancer-${sizeFlavor}.hour.consumption`,
          regions: [
            { name: 'region1', continentCode: 'EU' },
            { name: 'region2', continentCode: 'NA' },
          ],
        },
      ],
    };
    const networks = [
      {
        regions: [{ region: 'region1' }],
      },
    ];

    vi.mocked(useGetPlans).mockReturnValue({
      data: plansResponse,
      isPending: false,
    } as UseQueryResult<TPlanResponse>);
    vi.mocked(useGetPrivateNetworks).mockReturnValue({
      data: networks,
      isPending: false,
    } as UseQueryResult<TPrivateNetwork[]>);

    const { result } = renderHook(() => useGetRegions(projectId));

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data.get(sizeFlavor)).toEqual([
      {
        continent: 'manager_components_region_continent_region',
        continentCode: 'EU',
        isEnabled: true,
        macroName: 'manager_components_region_region',
        microName: 'manager_components_region_region_micro',
        name: 'region1',
      },
      {
        name: 'region2',
        continent: 'manager_components_region_continent_region',
        isEnabled: false,
        continentCode: 'NA',
        macroName: 'manager_components_region_region',
        microName: 'manager_components_region_region_micro',
      },
    ]);
  });

  it('should handle empty plans and networks', async () => {
    vi.mocked(useGetPlans).mockReturnValue({
      data: { plans: [] },
      isPending: false,
    } as UseQueryResult<TPlanResponse>);
    vi.mocked(useGetPrivateNetworks).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<TPrivateNetwork[]>);

    const { result } = renderHook(() => useGetRegions(projectId));
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data.size).toBe(0);
  });
});

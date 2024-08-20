import { renderHook, waitFor } from '@testing-library/react';
import { IMe, useMe } from '@ovhcloud/manager-components';
import { vi, describe, it } from 'vitest';
import {
  getProductAvailability,
  TProductAvailability,
} from '../data/availability';
import { useProductAvailability } from './useAvailability';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/availability', () => ({
  getProductAvailability: vi.fn(),
}));

describe('useProductAvailability', () => {
  it('returns product availability data successfully', async () => {
    const mockData = {
      plans: [
        {
          code: 'plan1',
          regions: [
            {
              continentCode: 'EU',
              datacenter: 'datacenter1',
              enabled: true,
              name: 'region1',
              type: 'region',
            },
          ],
        },
      ],
      products: [
        {
          name: 'product1',
          regions: [
            {
              continentCode: 'EU',
              datacenter: 'datacenter1',
              enabled: true,
              name: 'region1',
              type: 'region',
            },
          ],
        },
      ],
    } as TProductAvailability;
    vi.mocked(useMe).mockReturnValue({ me: { ovhSubsidiary: 'FR' } as IMe });
    vi.mocked(getProductAvailability).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useProductAvailability('project1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(useMe).mockReturnValue({ me: { ovhSubsidiary: 'FR' } as IMe });
    vi.mocked(getProductAvailability).mockRejectedValueOnce(
      new Error(errorMessage),
    );
    const { result } = renderHook(() => useProductAvailability('project1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe(errorMessage);
  });

  it('returns undefined when me is not available', async () => {
    vi.mocked(useMe).mockReturnValue({ me: null });
    const { result } = renderHook(() => useProductAvailability('project1'), {
      wrapper,
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toBeUndefined();
  });
});

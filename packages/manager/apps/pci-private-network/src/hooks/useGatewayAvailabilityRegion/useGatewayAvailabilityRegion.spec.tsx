import { describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useGatewayAvailabilityRegion from './useGatewayAvailabilityRegion';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: {} }),
  useProductAvailability: vi.fn().mockReturnValue({
    data: {
      plans: [
        {
          code: 'planCode1',
          regions: [
            {
              name: 'GRA11',
            },
            { name: 'GRA7' },
          ],
        },
        {
          code: 'planCode2',
          regions: [
            {
              name: 'SGP1',
            },
          ],
        },
      ],
    },
  }),
}));

describe('useGatewayAvailabilityRegion', () => {
  it('should return false when gateway planCode does not exist for the region', () => {
    const { result } = renderHook(() =>
      useGatewayAvailabilityRegion('SGP1', 'planCode1'),
    );

    expect(result.current).toBe(false);
  });

  it('should return true when gateway planCode exist for the region', async () => {
    const { result } = renderHook(() =>
      useGatewayAvailabilityRegion('GRA11', 'planCode1'),
    );

    await waitFor(() => expect(result.current).toBe(true));
  });
});

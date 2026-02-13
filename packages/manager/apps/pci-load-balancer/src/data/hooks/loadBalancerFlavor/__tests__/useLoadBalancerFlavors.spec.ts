import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getLoadBalancerCatalog } from '@/data/api/loadBalancerCatalog.api';
import { getLoadBalancerFlavors } from '@/data/api/loadBalancerFlavor.api';
import { getLoadBalancerProductAvailability } from '@/data/api/loadBalancerProductAvailability.api';
import { TPrice } from '@/domain/entities/loadBalancerCatalog';
import { TLoadBalancerFlavor } from '@/domain/entities/loadBalancerFlavor';
import { wrapper } from '@/wrapperRenders';

import { useLoadBalancerFlavors } from '../useLoadBalancerFlavors';

vi.mock('@/data/api/loadBalancerFlavor.api', () => ({
  getLoadBalancerFlavors: vi.fn(),
}));

vi.mock('@/data/api/loadBalancerCatalog.api', () => ({
  getLoadBalancerCatalog: vi.fn(),
}));

vi.mock('@/data/api/loadBalancerProductAvailability.api', () => ({
  getLoadBalancerProductAvailability: vi.fn(),
}));

describe('useLoadBalancerFlavors', () => {
  it('calls getLoadBalancerFlavors with projectId and region and applies select', async () => {
    const flavors = [
      { id: 'id-1', name: 'small', region: 'BHS5' },
      { id: 'id-2', name: 'large', region: 'BHS5' },
    ];
    vi.mocked(getLoadBalancerFlavors).mockResolvedValue(flavors);
    vi.mocked(getLoadBalancerCatalog).mockResolvedValue([]);
    vi.mocked(getLoadBalancerProductAvailability).mockResolvedValue([]);

    const select = vi.fn((data: (TLoadBalancerFlavor & { pricing: TPrice[] })[]) => data.length);

    const { result } = renderHook(
      () =>
        useLoadBalancerFlavors({
          projectId: 'project-1',
          region: 'BHS5',
          ovhSubsidiary: 'EU',
          select,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(getLoadBalancerFlavors).toHaveBeenCalledWith({
      projectId: 'project-1',
      region: 'BHS5',
    });
    expect(select).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'id-1', name: 'small', region: 'BHS5', pricing: [] }),
        expect.objectContaining({ id: 'id-2', name: 'large', region: 'BHS5', pricing: [] }),
      ]),
    );
    expect(result.current.loadBalancerFlavors).toBe(2);
  });
});

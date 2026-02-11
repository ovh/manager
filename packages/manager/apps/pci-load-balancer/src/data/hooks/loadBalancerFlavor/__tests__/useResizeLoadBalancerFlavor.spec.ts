import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { loadBalancerFlavorAdapter } from '@/adapters/tanstack/loadBalancerFlavor/right/loadBalancerFlavorAdapter';
import { wrapper } from '@/wrapperRenders';

import { useResizeLoadBalancerFlavor } from '../useResizeLoadBalancerFlavor';

vi.mock('@/adapters/tanstack/loadBalancerFlavor/right/loadBalancerFlavorAdapter', () => ({
  loadBalancerFlavorAdapter: {
    resizeFlavor: vi.fn(),
  },
}));

describe('useResizeLoadBalancerFlavor', () => {
  const projectId = 'project-1';
  const region = 'BHS5';
  const loadBalancerId = 'lb-1';

  it('returns a mutation with mutate and mutateAsync', () => {
    const { result } = renderHook(
      () => useResizeLoadBalancerFlavor({ projectId, region, loadBalancerId }),
      { wrapper },
    );

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
  });

  it('calls loadBalancerFlavorAdapter.resizeFlavor with projectId, region, loadBalancerId and flavor when mutate is invoked', async () => {
    vi.mocked(loadBalancerFlavorAdapter.resizeFlavor).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useResizeLoadBalancerFlavor({ projectId, region, loadBalancerId }),
      { wrapper },
    );

    const flavor = {
      flavorId: 'flavor-id-1',
      description: 'Small flavor',
      name: 'small',
    };

    await result.current.mutateAsync(flavor);

    expect(loadBalancerFlavorAdapter.resizeFlavor).toHaveBeenCalledWith({
      projectId,
      region,
      loadBalancerId,
      flavor,
    });
  });
});

import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListGuard from './ListGuard';

const regions = [];
let nonLocalNetworks = [];
let localNetworks = [];
let nonLocalNetworksPending = false;
let localNetworksPending = false;

vi.mock('@/api/hooks/useNetwork', async () => ({
  useAggregatedNonLocalNetworks: () => ({
    data: nonLocalNetworks,
    isPending: nonLocalNetworksPending,
  }),
  useAggregatedLocalNetworks: () => ({
    data: localNetworks,
    isPending: localNetworksPending,
  }),
}));

vi.mock('@/api/hooks/useRegions', async () => ({
  useProjectRegions: () => ({
    data: regions,
  }),
}));

vi.mock('react-router-dom', async () => ({
  Navigate: ({ to }: { to: string }) => <span>{to}</span>,
}));

describe('ListGuard', () => {
  it('should redirect to onboarding page when list of networks is empty', async () => {
    nonLocalNetworks = [];
    localNetworks = [];
    nonLocalNetworksPending = false;
    localNetworksPending = false;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild.textContent).toBe(
      '/pci/projects/123/private-networks/onboarding',
    );
  });

  it('should display children when list of networks is not empty', async () => {
    nonLocalNetworks = [{}];
    localNetworks = [{}];
    nonLocalNetworksPending = false;
    localNetworksPending = false;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild.textContent).toBe('child');
  });

  it('should display nothing while the networks list is not available', async () => {
    nonLocalNetworks = undefined;
    localNetworks = undefined;
    nonLocalNetworksPending = true;
    localNetworksPending = true;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild).toBe(null);
  });
});

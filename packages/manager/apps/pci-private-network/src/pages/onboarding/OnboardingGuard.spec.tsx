import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnBoardingGuard from './OnboardingGuard';

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

describe('OnBoardingGuard', () => {
  it('should redirect to private networks page when list of networks is not empty', async () => {
    nonLocalNetworks = [{}];
    localNetworks = [{}];
    nonLocalNetworksPending = false;
    localNetworksPending = false;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild.textContent).toBe(
      '/pci/projects/123/private-networks',
    );
  });

  it('should display children when list of networks is empty', async () => {
    nonLocalNetworks = [];
    localNetworks = [];
    nonLocalNetworksPending = false;
    localNetworksPending = false;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild.textContent).toBe('child');
  });

  it('should display nothing while the networks list is not available', async () => {
    nonLocalNetworks = undefined;
    localNetworks = undefined;
    nonLocalNetworksPending = true;
    localNetworksPending = true;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild).toBe(null);
  });
});

import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnBoardingGuard from './OnBoardingGuard';

let data = [];
let isPending = false;

vi.mock('@/api/hooks/useGateway', async () => ({
  useAllAggregatedGateway: () => ({
    data,
    isPending,
  }),
}));

vi.mock('react-router-dom', async () => ({
  Navigate: ({ to }: { to: string }) => <span>{to}</span>,
}));

describe('ListGuard', () => {
  it('should redirect to listing page when list of aggregated gateways is not empty', async () => {
    data = [{}];
    isPending = false;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild.textContent).toBe('/pci/projects/123/gateway');
  });

  it('should display children when list of aggregated gateways is empty', async () => {
    data = [];
    isPending = false;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild.textContent).toBe('child');
  });

  it('should display nothing while the aggregated gateways list is not available', async () => {
    data = undefined;
    isPending = true;
    const { container } = render(
      <OnBoardingGuard projectId="123">
        <span>child</span>
      </OnBoardingGuard>,
    );
    expect(container.firstChild).toBe(null);
  });
});

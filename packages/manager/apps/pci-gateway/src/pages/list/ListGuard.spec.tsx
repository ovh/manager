import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListGuard from './ListGuard';

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
  it('should redirect to onboarding page when list of aggregated gateways is empty', async () => {
    data = [];
    isPending = false;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild.textContent).toBe(
      '/pci/projects/123/gateway/onboarding',
    );
  });

  it('should display children when list of aggregated gateways is not empty', async () => {
    data = [{}];
    isPending = false;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild.textContent).toBe('child');
  });

  it('should display nothing while the aggregated gateways list is not available', async () => {
    data = undefined;
    isPending = true;
    const { container } = render(
      <ListGuard projectId="123">
        <span>child</span>
      </ListGuard>,
    );
    expect(container.firstChild).toBe(null);
  });
});

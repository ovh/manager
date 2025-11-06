import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { ServiceInfo } from '@/types/Dashboard.type';

import { BillingTile } from '../BillingTile.component';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('BillingTile', () => {
  const mockServiceInfo: ServiceInfo = {
    serviceType: 'DEDICATED_NASHA',
    creation: '2024-01-01',
    expiration: '2024-12-31',
    engagedUpTo: '2024-12-31',
    status: 'active',
  };

  const mockServicePath = '/dedicated/nasha/nasha-test-1';

  it('should render billing tile with service info', () => {
    render(
      <BillingTile
        serviceInfo={mockServiceInfo}
        servicePath={mockServicePath}
        withEngagement={true}
        shouldReengage={false}
      />,
    );

    expect(screen.getByText('billing.title')).toBeInTheDocument();
    expect(screen.getByText('billing.creation')).toBeInTheDocument();
    expect(screen.getByText('billing.expiration')).toBeInTheDocument();
    expect(screen.getByText('billing.status')).toBeInTheDocument();
  });

  it('should render engagement when withEngagement is true', () => {
    render(
      <BillingTile
        serviceInfo={mockServiceInfo}
        servicePath={mockServicePath}
        withEngagement={true}
        shouldReengage={false}
      />,
    );

    expect(screen.getByText('billing.engagement')).toBeInTheDocument();
  });

  it('should not render engagement when withEngagement is false', () => {
    render(
      <BillingTile
        serviceInfo={mockServiceInfo}
        servicePath={mockServicePath}
        withEngagement={false}
        shouldReengage={false}
      />,
    );

    expect(screen.queryByText('billing.engagement')).not.toBeInTheDocument();
  });
});


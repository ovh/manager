import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BillingUsageCell } from '../BillingUsageCell.components';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="DataGridTextCell">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: () => <div data-testid="OdsSkeleton" />,
}));

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => ({
  useGetServiceConsumptionOptions: vi.fn(() => vi.fn()),
}));

vi.mock('@/hooks/useGetVaultConsumptionDetails', () => ({
  useGetVaultConsumptionDetails: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('BillingUsageCell', () => {
  it('should display usage label when data is present', () => {
    mockUseQuery.mockReturnValue({
      data: [10],
      isPending: false,
    });

    render(<BillingUsageCell vaultId="vault-id" />);

    expect(screen.getByText('10 unit_size_GB')).toBeVisible();
  });

  it('should display "-" when consumption details are not present', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<BillingUsageCell vaultId="vault-id" />);

    expect(screen.getByText('-')).toBeVisible();
  });

  it('should display skeleton during loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    render(<BillingUsageCell vaultId="vault-id" />);

    expect(screen.getByTestId('OdsSkeleton')).toBeVisible();
  });
});

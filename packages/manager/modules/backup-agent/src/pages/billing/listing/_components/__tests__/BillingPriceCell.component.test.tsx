import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { OdsSkeletonMock } from '@/test-utils/mocks/ods-components';

import { BillingPriceCell } from '../BillingPriceCell.components';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: OdsSkeletonMock,
}));

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => ({
  useGetServiceConsumptionOptions: vi.fn(() => vi.fn()),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

describe('BillingPriceCell', () => {
  it('should display price when data is present', () => {
    mockUseQuery.mockReturnValue({
      data: '30.00 €',
      isPending: false,
    });

    render(<BillingPriceCell vaultId="vault-id" />);

    expect(screen.getByText('30.00 €')).toBeVisible();
  });

  it('should display skeleton during loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    render(<BillingPriceCell vaultId="vault-id" />);

    expect(screen.getByTestId('ods-skeleton')).toBeVisible();
  });
});

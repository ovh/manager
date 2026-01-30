import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { OdsSkeletonMock } from '@/test-utils/mocks/ods-components';
import { useTranslationMock } from '@/test-utils/mocks/react-i18next';

import { BillingUsageCell } from '../BillingUsageCell.components';

const { mockUseQuery } = vi.hoisted(() => ({
  mockUseQuery: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: OdsSkeletonMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
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

describe('BillingUsageCell', () => {
  it('should display usage label when data is present', () => {
    mockUseQuery.mockReturnValue({
      data: [10],
      isPending: false,
    });

    render(<BillingUsageCell vaultId="vault-id" />);

    expect(screen.getByText('10 translated_unit_size_GB')).toBeVisible();
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

    expect(screen.getByTestId('ods-skeleton')).toBeVisible();
  });
});

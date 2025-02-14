import { describe, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import IncreaseQuotaPage from './IncreaseQuota.page';
import { wrapper } from '@/wrapperRenders';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';
import { TServiceOption } from '@/api/data/service-option';
import { useGetIssueTypes } from '@/api/hooks/useIssueTypes';
import { TIssueType } from '@/api/data/issue';

vi.mock('@/api/hooks/useIssueTypes', () => ({
  useGetIssueTypes: vi.fn(),
}));

vi.mock('@/api/hooks/useServiceOptions', () => ({
  useGetFilteredServiceOptions: vi.fn(),
}));

vi.mock('@/api/data', () => ({
  checkoutCart: vi.fn(),
  createAndAssignCart: vi.fn(),
  orderQuota: vi.fn(),
}));

vi.mock('@/api/data/ticket', () => ({
  createTicket: vi.fn(),
}));

describe('IncreaseQuotaPage', () => {
  beforeEach(() => {
    vi.mocked(useGetIssueTypes).mockReturnValue({
      data: [{ id: '1', label: 'Issue Type', subject: 'Subject' }],
    } as UseQueryResult<TIssueType[]>);
    vi.mocked(useGetFilteredServiceOptions).mockReturnValue({
      data: [
        {
          planCode: 'quota-no-plan',
          prices: [
            {
              capacities: ['installation'],
              duration: 'P1M',
              price: 'price',
              pricingMode: 'default',
            },
          ],
        },
      ],
    } as UseQueryResult<TServiceOption[]>);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/quota/increase',
    } as never);
  });

  it('should render IncreaseQuotaPage', () => {
    render(<IncreaseQuotaPage />, { wrapper });

    expect(
      screen.getByText('pci_projects_project_quota_increase_buy_credits'),
    ).toBeInTheDocument();
  });
});

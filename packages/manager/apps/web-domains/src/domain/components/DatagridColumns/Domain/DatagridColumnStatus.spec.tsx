import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTranslation } from 'react-i18next';
import DatagridColumnStatus from './DatagridColumnStatus';
import { DomainServiceStateEnum } from '@/domain/types/domainResource';
import { DOMAIN_STATE } from '@/domain/constants/serviceDetail';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@/domain/utils/domainStatus', () => ({
  domainStatusToBadge: vi.fn((mapping, state) => {
    const statusDetails = mapping[state];
    return statusDetails
      ? {
          statusColor: 'success',
          icon: 'check-circle',
          i18nKey: `domain_status_${state}`,
        }
      : null;
  }),
}));

describe('DatagridColumnStatus', () => {
  const mockT = vi.fn((key: string) => `translated_${key}`);

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });
  });

  it('should render badge with status when state exists in mapping', () => {
    const state = DomainServiceStateEnum.OK;
    const mapping = DOMAIN_STATE;

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${state}`);
    expect(badge).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith(`domain_status_${state}`);
  });

  it('should not render badge when state does not exist in mapping', () => {
    const state = 'INVALID_STATE' as DomainServiceStateEnum;
    const mapping = {};

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.queryByTestId(`status-badge-${state}`);
    expect(badge).not.toBeInTheDocument();
  });

  it('should render badge with correct test id', () => {
    const state = DomainServiceStateEnum.EXPIRED;
    const mapping = DOMAIN_STATE;

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${state}`);
    expect(badge).toBeInTheDocument();
  });
});

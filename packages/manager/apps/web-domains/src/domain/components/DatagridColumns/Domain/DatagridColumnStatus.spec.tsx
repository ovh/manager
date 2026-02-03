import React from 'react';
import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useTranslation } from 'react-i18next';
import DatagridColumnStatus from './DatagridColumnStatus';
import { DOMAIN_STATE } from '@/domain/constants/serviceDetail';
import { wrapper } from '@/common/utils/test.provider';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: vi.fn(),
  };
});

vi.mock('@ovh-ux/muk', () => ({
  CellRow: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
}));

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Badge: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="badge">{children}</span>
    ),
    Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
  };
});

vi.mock('@/domain/utils/domainStatus', () => ({
  domainStatusToBadge: vi.fn((mapping, state) => {
    const statusDetails = mapping[state];
    return statusDetails
      ? {
        statusColor: 'success',
        icon: 'check-circle',
        i18nKey: 'domain_tab_general_information_registered',
      }
      : null;
  }),
}));

describe('DatagridColumnStatus', () => {
  const mockT = vi.fn((key: string) => `translated_${key}`);

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as ReturnType<typeof vi.fn>).mockReturnValue({
      t: mockT,
    });
  });

  it('should render badge with status when state exists in mapping', () => {
    const state = DomainStateEnum.OK;
    const mapping = DOMAIN_STATE;

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${state}`);
    expect(badge).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith(
      `domain_tab_general_information_registered`,
    );
  });

  it('should not render badge when state does not exist in mapping', () => {
    const state = 'INVALID_STATE' as DomainStateEnum;
    const mapping = {};

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.queryByTestId(`status-badge-${state}`);
    expect(badge).not.toBeInTheDocument();
  });

  it('should render badge with correct test id', () => {
    const state = DomainStateEnum.EXPIRED;
    const mapping = DOMAIN_STATE;

    render(<DatagridColumnStatus state={state} mapping={mapping} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${state}`);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(
      'translated_domain_tab_general_information_registered',
    );
  });
});

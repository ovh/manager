import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { BADGE_COLOR } from '@ovh-ux/muk';

import { DnsStatus, GitStatus, ServiceStatus } from '@/data/types/status';
import { createWrapper, i18n } from '@/utils/test.provider';

import { BadgeStatus } from '../badgeStatus/BadgeStatus.component';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('BadgeStatus component', () => {
  it('should open the href in a new tab when clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} href="https://example.com" />, {
      wrapper: Wrappers as ComponentType,
    });
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    openSpy.mockRestore();
  });

  it('should render with all possible colors', () => {
    const testCases = [
      { status: DnsStatus.CONFIGURED, color: BADGE_COLOR.success },
      { status: DnsStatus.EXTERNAL, color: BADGE_COLOR.warning },
      { status: DnsStatus.NOT_CONFIGURED, color: BADGE_COLOR.neutral },
      { status: GitStatus.CREATED, color: BADGE_COLOR.success },
      { status: GitStatus.DELETING, color: BADGE_COLOR.warning },
      { status: GitStatus.ERROR, color: BADGE_COLOR.critical },
      { status: ServiceStatus.ACTIVE, color: BADGE_COLOR.success },
      { status: ServiceStatus.NONE, color: BADGE_COLOR.neutral },
    ];

    testCases.forEach(({ status, color }) => {
      render(<BadgeStatus itemStatus={status} />, { wrapper: Wrappers as ComponentType });
      const badge = screen.getByTestId(`badge-status-${status}`);
      expect(badge).toHaveAttribute('color', color);
    });
  });
});

import { ComponentType } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BADGE_COLOR } from '@ovh-ux/muk';

import { DnsStatus, GitStatus, ServiceStatus } from '@/data/types/status';
import { wrapper } from '@/utils/test.provider';

import { BadgeStatus } from '../badgeStatus/BadgeStatus.component';

describe('BadgeStatus component', () => {
  it('should open the href in a new tab when clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} href="https://example.com" />, {
      wrapper: wrapper as ComponentType,
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
      render(<BadgeStatus itemStatus={status} />, { wrapper: wrapper as ComponentType });
      const badge = screen.getByTestId(`badge-status-${status}`);
      expect(badge).toHaveAttribute('color', color);
    });
  });
});

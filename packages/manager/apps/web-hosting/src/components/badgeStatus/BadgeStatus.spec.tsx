import { describe, expect, it, vi } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { DnsStatus, GitStatus, ServiceStatus } from '@/data/types/status';
import { render, screen } from '@/utils/test.provider';

import { BadgeStatus } from '../badgeStatus/BadgeStatus.component';

describe('BadgeStatus component', () => {
  it('should open the href in a new tab when clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} href="https://example.com" />);
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    openSpy.mockRestore();
  });

  it('should render with all possible colors', () => {
    const testCases = [
      { status: DnsStatus.CONFIGURED, color: ODS_BADGE_COLOR.success },
      { status: DnsStatus.EXTERNAL, color: ODS_BADGE_COLOR.warning },
      { status: DnsStatus.NOT_CONFIGURED, color: ODS_BADGE_COLOR.neutral },
      { status: GitStatus.CREATED, color: ODS_BADGE_COLOR.success },
      { status: GitStatus.DELETING, color: ODS_BADGE_COLOR.warning },
      { status: GitStatus.ERROR, color: ODS_BADGE_COLOR.critical },
      { status: ServiceStatus.ACTIVE, color: ODS_BADGE_COLOR.success },
      { status: ServiceStatus.NONE, color: ODS_BADGE_COLOR.critical },
    ];

    testCases.forEach(({ status, color }) => {
      render(<BadgeStatus itemStatus={status} />);
      const badge = screen.getByTestId(`badge-status-${status}`);
      expect(badge).toHaveAttribute('color', color);
    });
  });
});

import React from 'react';
import { describe, it, expect } from 'vitest';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { render, screen, waitFor } from '@/test.provider';
import { BadgeStatus } from '../BadgeStatus';

describe('BadgeStatus component', () => {
  it('should render an href with the url', async () => {
    render(
      <BadgeStatus itemStatus="DNS_CONFIGURED" href="https://example.com" />,
    );

    await waitFor(() => {
      const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
      expect(component.hasAttribute(ODS_BADGE_COLOR.success));
    });
  });

  it('should render with all possible colors', async () => {
    const testCases = [
      { status: 'DNS_CONFIGURED', color: ODS_BADGE_COLOR.success },
      { status: 'DNS_EXTERNAL', color: ODS_BADGE_COLOR.warning },
      { status: 'DNS_NOT_CONFIGURED', color: ODS_BADGE_COLOR.neutral },
      { status: 'UNKNOWN_STATUS', color: ODS_BADGE_COLOR.information },
      { status: 'CREATED', color: ODS_BADGE_COLOR.success },
      { status: 'DELETING', color: ODS_BADGE_COLOR.warning },
      { status: 'ERROR', color: ODS_BADGE_COLOR.critical },
      { status: 'ACTIVE', color: ODS_BADGE_COLOR.success },
      { status: 'NONE', color: ODS_BADGE_COLOR.critical },
    ];

    testCases.forEach(({ status, color }) => {
      render(<BadgeStatus itemStatus={status} />);
      const badge = screen.getByTestId(`badge-status-${status}`);
      expect(badge.hasAttribute(color));
    });
  });
});

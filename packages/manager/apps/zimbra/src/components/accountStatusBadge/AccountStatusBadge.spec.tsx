import React from 'react';

import { describe, expect } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { CurrentAccountStatus, ResourceStatus } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import AccountStatusBadge from './AccountStatusBadge.component';

const accountMock = {
  id: '1',
  email: 'test@test.fr',
  offer: 'STARTER',
  organizationId: '2',
  organizationLabel: 'testorgLabel',
  used: 1,
  available: 2,
  status: ResourceStatus.READY,
  slotId: '123-123',
  detailedStatus: [] as {
    details: string;
    link: string;
    status: keyof typeof CurrentAccountStatus;
  }[],
};

describe('Account status badge', () => {
  it('should correctly display "BLOCKEDFORSPAM" state', () => {
    const { getByTestId } = render(
      <AccountStatusBadge
        {...{
          ...accountMock,
          detailedStatus: [
            {
              details: 'string',
              link: 'string',
              status: CurrentAccountStatus.BLOCKEDFORSPAM,
            },
          ],
        }}
      />,
    );

    const badge = getByTestId(`1_${CurrentAccountStatus.BLOCKEDFORSPAM}`);
    expect(badge).toHaveAttribute('label', commonTranslation.account_state_blockedforspam);
    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });

  it('should correctly display "READY" state', () => {
    const { getByTestId } = render(<AccountStatusBadge {...accountMock} />);

    const badge = getByTestId(`1_${ResourceStatus.READY}`);
    expect(badge).toHaveAttribute('label', commonTranslation.service_state_ready);
    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.success);
  });
});

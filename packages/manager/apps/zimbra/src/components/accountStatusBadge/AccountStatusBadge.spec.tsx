import React from 'react';

import { describe, expect } from 'vitest';

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
    expect(badge).toHaveTextContent(commonTranslation.account_state_blockedforspam);
  });

  it('should correctly display "READY" state', () => {
    const { getByTestId } = render(<AccountStatusBadge {...accountMock} />);

    const badge = getByTestId(`1_${ResourceStatus.READY}`);
    expect(badge).toHaveTextContent(commonTranslation.service_state_ready);
  });
});

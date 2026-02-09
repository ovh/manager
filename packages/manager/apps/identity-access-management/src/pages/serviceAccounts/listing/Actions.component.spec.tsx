import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { createWrapper } from '@/test-utils/wrapperRender';

import { Actions } from './Actions.component';
import { IamServiceAccount } from '@/data/api/iam-service-accounts';

const wrapper = createWrapper();

const MOCK_ACCOUNT: IamServiceAccount = {
  name: 'fake_account_1',
  description: 'Fake Account 1',
  clientId: 'fake-account-1',
  identity: null,
  createdAt: '2025-05-11T00:00:00+02:00',
};

describe('ActionsComponent', () => {
  it('should render the ActionMenu with the correct items', () => {
    const { getByTestId } = render(<Actions account={MOCK_ACCOUNT} />, { wrapper });
    const popover = getByTestId('navigation-action-trigger-action-popover');
    const items = popover.querySelectorAll('ods-button');
    expect(items).toHaveLength(2);
  });
});

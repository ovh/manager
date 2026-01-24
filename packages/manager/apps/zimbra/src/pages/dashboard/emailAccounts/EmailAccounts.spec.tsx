import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { render } from '@/utils/test.provider';

import EmailAccounts from './EmailAccounts.page';

describe('EmailAccounts page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    expect(button).toHaveTextContent(actionsCommonTranslation.configure);

    expect(button).toBeDisabled();
  });
});

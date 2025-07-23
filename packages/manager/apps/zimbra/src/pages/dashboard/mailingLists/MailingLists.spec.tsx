import React from 'react';

import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test.provider';

import MailingLists from './MailingLists.page';

describe('Mailing Lists page', () => {
  it('should display add button correctly', async () => {
    const { getByTestId, queryByTestId } = render(<MailingLists />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('add-mailinglist-btn');
    expect(button).toHaveAttribute('label', commonTranslation.add_mailing_list);

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});

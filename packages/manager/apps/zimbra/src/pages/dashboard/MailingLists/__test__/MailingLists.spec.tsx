import React from 'react';
import { describe, expect } from 'vitest';
import { render, waitFor } from '@/utils/test.provider';
import mailingListsTranslation from '@/public/translations/mailinglists/Messages_fr_FR.json';
import MailingLists from '../MailingLists';

describe('Mailing Lists page', () => {
  it('should display add button correctly', async () => {
    const { getByTestId, queryByTestId } = render(<MailingLists />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('add-mailinglist-btn');
    expect(button).toHaveAttribute(
      'label',
      mailingListsTranslation.zimbra_mailinglists_datagrid_cta,
    );

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});

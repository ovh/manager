import React from 'react';
import { vi, describe, expect } from 'vitest';
import { render, waitFor } from '@/utils/test.provider';
import mailingListsTranslation from '@/public/translations/mailinglists/Messages_fr_FR.json';
import MailingLists from '../MailingLists';
import { useGenerateUrl } from '@/hooks';

const addUrl = '#/00000000-0000-0000-0000-000000000001/mailing_lists/add';

describe('Mailing Lists page', () => {
  it('should display add button correctly', async () => {
    vi.mocked(useGenerateUrl).mockReturnValue(addUrl);

    const { getByTestId, queryByTestId } = render(<MailingLists />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('add-mailinglist-btn');
    expect(button).toHaveAttribute('href', addUrl);
    expect(button).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_cta,
    );
  });
});

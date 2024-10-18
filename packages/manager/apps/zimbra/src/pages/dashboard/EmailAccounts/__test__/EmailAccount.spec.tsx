import React from 'react';
import { vi, describe, expect } from 'vitest';
import EmailAccounts from '../EmailAccounts';
import { render, waitFor } from '@/utils/test.provider';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { useGenerateUrl } from '@/hooks';

const addUrl = '#/00000000-0000-0000-0000-000000000001/email_accounts/add?';

describe('EmailAccounts page', () => {
  it('Page should display correctly', async () => {
    vi.mocked(useGenerateUrl).mockReturnValue(addUrl);
    const { getByTestId } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');
    expect(button).toHaveAttribute('href', addUrl);
    expect(button).toHaveTextContent(
      accountTranslation.zimbra_account_account_add,
    );
  });
});

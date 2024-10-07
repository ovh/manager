import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { Location, useLocation, useSearchParams } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@/utils/test.provider';
import { accountDetailMock } from '@/api/_mock_';
import AddAndEditEmailAccount from '../AddAndEditEmailAccount.page';
import emailAccountAddAndEditTranslation from '@/public/translations/accounts/addAndEdit/Messages_fr_FR.json';
import emailAccountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

describe('email account add and edit page', () => {
  it('if there is not editEmailAccountId params', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/settings',
    } as Location);

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    const { getByTestId, queryByTestId } = render(<AddAndEditEmailAccount />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_add_title,
    );
  });

  it('if there is editEmailAccountId params', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/settings',
      search: `?editEmailAccountId=${accountDetailMock}`,
    } as Location);

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editEmailAccountId: accountDetailMock.id,
      }),
      vi.fn(),
    ]);

    const { getByTestId, queryByTestId } = render(<AddAndEditEmailAccount />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_edit_title.replace(
        '{{ account }}',
        accountDetailMock.currentState?.email,
      ),
    );
  });

  it('test alias tabs page', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/alias',
    } as Location);

    const { getByText } = render(<AddAndEditEmailAccount />);

    expect(
      getByText(emailAccountAliasTranslation.zimbra_account_alias_title),
    ).toBeInTheDocument();
  });

  it('should display redirection tab page', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname:
        '/00000000-0000-0000-0000-000000000001/email_accounts/redirections',
    } as Location);

    const { getByText } = render(<AddAndEditEmailAccount />);

    expect(
      getByText(redirectionsTranslation.zimbra_redirections_account_title),
    ).toBeInTheDocument();
  });

  it('check validity form', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/settings',
      search: `?editEmailAccountId=${accountDetailMock}`,
    } as Location);

    const { getByTestId } = render(<AddAndEditEmailAccount />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputPassword = getByTestId('input-password');

    expect(button).not.toBeEnabled();

    act(() => {
      fireEvent.change(inputAccount, { target: { value: '' } });
      inputAccount.odsInputBlur.emit({ name: 'account', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');

    act(() => {
      fireEvent.change(inputAccount, { target: { value: 'account' } });
      fireEvent.change(selectDomain, { target: { value: 'domain' } });
      fireEvent.change(inputPassword, {
        target: { value: 'PasswordWithGoodPattern1&' },
      });
      // it seems we have to manually trigger the ods event
      inputAccount.odsValueChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'PasswordWithGoodPattern1&',
      });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      fireEvent.change(inputPassword, {
        target: { value: 'PasswordWithGoodPattern1&' },
      });
      // it seems we have to manually trigger the ods event
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'PasswordWithoutGoodPattern',
      });
    });
    expect(button).not.toBeEnabled();
  });
});

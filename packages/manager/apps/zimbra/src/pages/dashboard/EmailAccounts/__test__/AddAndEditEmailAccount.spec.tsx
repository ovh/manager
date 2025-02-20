import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { Location, useLocation, useSearchParams } from 'react-router-dom';
import { render, waitFor, act } from '@/utils/test.provider';
import { accountDetailMock } from '@/api/_mock_';
import AddAndEditEmailAccount from '../AddAndEditEmailAccount.page';
import emailAccountFormTranslation from '@/public/translations/accounts/form/Messages_fr_FR.json';
import emailAccountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';
import autoRepliesTranslation from '@/public/translations/auto-replies/Messages_fr_FR.json';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

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
      commonTranslation.add_email_account,
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
      emailAccountFormTranslation.zimbra_account_edit_title.replace(
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

  it('should display autoreplies tab page', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname:
        '/00000000-0000-0000-0000-000000000001/email_accounts/auto_replies',
    } as Location);

    const { getByText } = render(<AddAndEditEmailAccount />);

    expect(
      getByText(autoRepliesTranslation.zimbra_auto_replies_account_title),
    ).toBeInTheDocument();
  });

  it('check validity form', async () => {
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

    const { getByTestId } = render(<AddAndEditEmailAccount />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputPassword = getByTestId('input-password');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputPassword.odsBlur.emit({ name: 'password', value: '' });
      inputAccount.odsChange.emit({ name: 'account', value: '' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(inputPassword).toHaveAttribute('has-error', 'false');

    act(() => {
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain' });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'PasswordWithGoodPattern1&',
      });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(inputPassword).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      // Uppercased + digit + 10 characters total
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // No uppercased + digit or special + 10 characters total
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // Uppercased + special + 10 characters total
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa#',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // Uppercased + digit or special but 9 characters total
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // Uppercased + digit AND special + 10 characters total
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaa1#a',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');
  });
});

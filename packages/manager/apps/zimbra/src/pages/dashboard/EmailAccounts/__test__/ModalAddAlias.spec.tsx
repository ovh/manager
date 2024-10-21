import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useResolvedPath, useSearchParams } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@/utils/test.provider';
import { accountDetailMock } from '@/api/_mock_';
import ModalAddAlias from '../ModalAddAlias.component';
import emailAccountAliasAddTranslation from '@/public/translations/accounts/alias/add/Messages_fr_FR.json';

vi.mocked(useResolvedPath).mockReturnValue({
  pathname: '/:serviceName/email_accounts/alias/add',
  search: '',
  hash: '',
});

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    editEmailAccountId: accountDetailMock.id,
  }),
  vi.fn(),
]);

describe('add alias modal', () => {
  it('if modal are displayed', async () => {
    const { queryByTestId } = render(<ModalAddAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    screen.getByText(
      emailAccountAliasAddTranslation.zimbra_account_alias_add_description.replace(
        '{{ account }}',
        accountDetailMock.currentState?.email,
      ),
    );
  });

  it('check validity form', async () => {
    const { getByTestId, queryByTestId } = render(<ModalAddAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-alias');
    const selectDomain = getByTestId('select-domain');

    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsInputBlur.emit({ name: 'alias', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');

    act(() => {
      fireEvent.change(inputAccount, { target: { value: 'alias' } });
      fireEvent.change(selectDomain, { target: { value: 'domain' } });

      // it seems we have to manually trigger the ods event
      inputAccount.odsValueChange.emit({ name: 'alias', value: 'alias' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();
  });
});

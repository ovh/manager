import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useResolvedPath, useSearchParams } from 'react-router-dom';
import { render, screen, waitFor, act } from '@/utils/test.provider';
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

    screen.getByText(accountDetailMock.currentState?.email);
  });

  it('check validity form', async () => {
    const { getByTestId, queryByTestId } = render(<ModalAddAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-alias');
    const selectDomain = getByTestId('select-domain');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputAccount.odsBlur.emit({ name: 'alias', value: '' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');

    act(() => {
      inputAccount.odsChange.emit({ name: 'alias', value: 'alias' });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');
  });
});

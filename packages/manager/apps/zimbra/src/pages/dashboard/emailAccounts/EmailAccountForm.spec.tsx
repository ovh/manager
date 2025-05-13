import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import { useParams } from 'react-router-dom';
import { render, waitFor, act } from '@/utils/test.provider';
import EmailAccountForm from './EmailAccountForm.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { platformMock, accountMock } from '@/data/api';

describe('email account add and edit form', () => {
  it('should be in add mode if no accountId', async () => {
    const { getByTestId, queryByTestId } = render(<EmailAccountForm />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('confirm-btn')).toHaveAttribute(
      'label',
      commonTranslation.confirm,
    );
  });

  it('should be in edit mode if accountId', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      accountId: accountMock.id,
    });

    const { getByTestId, queryByTestId } = render(<EmailAccountForm />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('confirm-btn')).toHaveAttribute(
      'label',
      commonTranslation.save,
    );
  });

  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('check validity form', async () => {
    const { getByTestId } = render(<EmailAccountForm />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account') as any;
    const selectDomain = getByTestId('select-domain') as any;
    const inputPassword = getByTestId('input-password') as any;

    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      inputPassword.odsBlur.emit({ name: 'password', value: '' });
      selectDomain.odsBlur.emit({ name: 'domain', value: '' });
      inputAccount.odsBlur.emit({ name: 'account', value: '' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(selectDomain).toHaveAttribute('has-error', 'true');
    expect(inputPassword).toHaveAttribute('has-error', 'true');

    await act(() => {
      fireEvent.input(inputAccount, {
        target: { value: 'account' },
      });
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });

      fireEvent.input(selectDomain, {
        target: { value: 'domain.fr' },
      });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain.fr' });

      fireEvent.input(inputPassword, {
        target: { value: 'PasswordWithGoodPattern1&' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'PasswordWithGoodPattern1&',
      });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(selectDomain).toHaveAttribute('has-error', 'false');
    expect(inputPassword).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      // Uppercased + digit + 10 characters total
      fireEvent.input(inputPassword, {
        target: { value: 'Aaaaaaaaa1' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');

    await act(() => {
      // No uppercased + digit or special + 10 characters total
      fireEvent.input(inputPassword, {
        target: { value: 'aaaaaaaaa1' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');

    await act(() => {
      // Uppercased + special + 10 characters total
      fireEvent.input(inputPassword, {
        target: { value: 'Aaaaaaaaa#' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa#',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');

    await act(() => {
      // Uppercased + digit or special but 9 characters total
      fireEvent.input(inputPassword, {
        target: { value: 'Aaaaaaaa1' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'true');

    await act(() => {
      // Uppercased + digit AND special + 10 characters total
      fireEvent.input(inputPassword, {
        target: { value: 'Aaaaaaa1#a' },
      });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'Aaaaaaa1#a',
      });
    });

    expect(inputPassword).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');
  });
});

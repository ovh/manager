import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, act } from '@/utils/test.provider';
import { accountDetailMock, platformMock } from '@/api/_mock_';
import ModalAddAlias from '../ModalAddAlias.component';

describe('add alias modal', () => {
  it('should display modal', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      accountId: accountDetailMock.id,
    });

    const { queryByTestId } = render(<ModalAddAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    screen.getByText(accountDetailMock.currentState?.email);
  });

  it('should check the form validity', async () => {
    const { getByTestId, queryByTestId } = render(<ModalAddAlias />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');

    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      inputAccount.odsBlur.emit({});
      selectDomain.odsBlur.emit({});
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(selectDomain).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.input(inputAccount, {
        target: { value: 'alias' },
      });
      inputAccount.odsChange.emit({ name: 'account', value: 'alias' });

      fireEvent.change(selectDomain, {
        target: { value: 'domain.fr' },
      });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain.fr' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(selectDomain).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');
  });
});

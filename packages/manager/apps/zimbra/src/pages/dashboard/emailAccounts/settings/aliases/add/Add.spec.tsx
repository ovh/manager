import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { accountMock, platformMock } from '@/data/api';
import { act, fireEvent, render, screen, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

import AddAliasModal from './Add.modal';

describe('add alias modal', () => {
  it('should display modal', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      accountId: accountMock.id,
    });

    const { queryByTestId } = render(<AddAliasModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    screen.getByText(accountMock.currentState?.email);
  });

  it('should check the form validity', async () => {
    const { getByTestId, queryByTestId } = render(<AddAliasModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account') as OdsHTMLElement;
    const selectDomain = getByTestId('select-domain') as OdsHTMLElement;

    expect(button).toHaveAttribute('is-disabled', 'true');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      inputAccount.odsBlur.emit({});
      selectDomain.odsBlur.emit({});
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(selectDomain).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
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

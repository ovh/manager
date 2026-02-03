import React from 'react';

import { useParams } from 'react-router-dom';

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { accountMock, platformMock } from '@/data/api';
import { render } from '@/utils/test.provider';

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

  it.skip('should check the form validity', async () => {
    const { getByTestId, queryByTestId } = render(<AddAliasModal />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');

    expect(button).toBeDisabled();

    await user.clear(inputAccount);
    act(() => {
      fireEvent.blur(selectDomain);
    });
    await user.tab();

    expect(inputAccount).toHaveAttribute('data-invalid', 'true');
    expect(button).toBeDisabled();

    await user.type(inputAccount, 'alias');
    const selectDomainOption = selectDomain.querySelector('select');
    await user.selectOptions(selectDomainOption, 'domain.fr');
    await user.tab();

    screen.debug();

    expect(button).toBeEnabled();
  });
});

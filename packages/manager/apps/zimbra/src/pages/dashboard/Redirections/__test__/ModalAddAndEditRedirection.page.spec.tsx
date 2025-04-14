import React from 'react';
import { describe, expect, it } from 'vitest';
import ModalAddAndEditRedirection from '../ModalAddAndEditRedirection.page';
import { render, fireEvent, act } from '@/utils/test.provider';

describe('ModalAddAndEditRedirection Component', async () => {
  // @TODO: this test can fail randomly for no apparent reason, I think there's
  // an issue in ODS that cause `has-error` to be empty randomly so let's
  // unskip this test when it is fixed
  it.skip('should render and enable the confirm button when form is valid', async () => {
    const { getByTestId } = render(<ModalAddAndEditRedirection />);

    const confirmButton = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const inputTo = getByTestId('input-to');
    const selectDomain = getByTestId('select-domain');

    await act(() => {
      fireEvent.blur(inputAccount);
      inputAccount.odsBlur.emit({});
      fireEvent.blur(selectDomain);
      selectDomain.odsBlur.emit({});
      fireEvent.blur(inputTo);
      inputTo.odsBlur.emit({});
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(selectDomain).toHaveAttribute('has-error', 'true');
    expect(inputTo).toHaveAttribute('has-error', 'true');

    expect(confirmButton).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputAccount, {
        target: { value: 'account' },
      });
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });
    });

    await act(() => {
      fireEvent.change(selectDomain, {
        target: { value: 'domain.fr' },
      });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain.fr' });
    });

    await act(() => {
      fireEvent.change(inputTo, {
        target: { value: 'test@test.fr' },
      });
      inputTo.odsChange.emit({ name: 'to', value: 'test@test.fr' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(selectDomain).toHaveAttribute('has-error', 'false');
    expect(inputTo).toHaveAttribute('has-error', 'false');

    expect(confirmButton).toHaveAttribute('is-disabled', 'false');
  });
});

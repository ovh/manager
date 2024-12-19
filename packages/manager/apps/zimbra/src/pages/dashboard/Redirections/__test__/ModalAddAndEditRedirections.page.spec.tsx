import React from 'react';
import { describe, expect, it } from 'vitest';
import ModalAddAndEditRedirections from '../ModalAddAndEditRedirections.page';
import { render, fireEvent, act } from '@/utils/test.provider';

describe('ModalAddAndEditRedirections Component', async () => {
  it('should render and enable the confirm button when form is valid', async () => {
    const { getByTestId } = render(<ModalAddAndEditRedirections />);

    const confirmButton = getByTestId('confirm-btn');
    const checkbox = getByTestId('field-checkbox');
    const inputAccount = getByTestId('input-account');
    const inputTo = getByTestId('input-to');
    const selectDomain = getByTestId('select-domain');

    expect(confirmButton).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputAccount.odsBlur.emit({ name: 'account', value: '' });
      selectDomain.odsBlur.emit({ name: 'domain', value: '' });
      inputTo.odsBlur.emit({ name: 'to', value: '' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(inputTo).toHaveAttribute('has-error', 'true');

    expect(confirmButton).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain.fr' });
      inputTo.odsChange.emit({ name: 'to', value: 'test@test.fr' });
    });

    expect(inputAccount).toHaveAttribute('value', 'account');
    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(inputTo).toHaveAttribute('has-error', 'false');

    expect(confirmButton).toHaveAttribute('is-disabled', 'false');

    act(() => {
      fireEvent.click(checkbox);
    });

    expect(confirmButton).toHaveAttribute('is-disabled', 'false');
  });
});

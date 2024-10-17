import React from 'react';
import { describe, expect, it } from 'vitest';
import { act } from 'react-dom/test-utils';
import ModalAddAndEditRedirections from '../ModalAddAndEditRedirections.page';
import { render, fireEvent } from '@/utils/test.provider';

describe('ModalAddAndEditRedirections Component', () => {
  it('should render and enable the confirm button when form is valid', async () => {
    const { getByTestId } = render(<ModalAddAndEditRedirections />);

    const confirmButton = getByTestId('confirm-btn');
    const checkbox = getByTestId('field-checkbox');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputTo = getByTestId('input-to');

    expect(confirmButton).toBeDisabled();

    act(() => {
      inputAccount.odsValueChange.emit({ name: 'account', value: '' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: '' });
      inputTo.odsValueChange.emit({ name: 'to', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');
    expect(inputTo).toHaveAttribute('color', 'error');

    expect(confirmButton).toBeDisabled();

    act(() => {
      inputAccount.odsValueChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
      inputTo.odsValueChange.emit({ name: 'to', value: 'test@test.fr' });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(inputTo).toHaveAttribute('color', 'default');

    expect(confirmButton).toBeEnabled();

    act(() => {
      fireEvent.click(checkbox);
    });

    expect(confirmButton).toBeEnabled();
  });
});

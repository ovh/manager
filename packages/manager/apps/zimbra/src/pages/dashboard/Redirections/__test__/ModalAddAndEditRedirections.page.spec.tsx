import React from 'react';
import { vi, describe, expect, it, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import ModalAddAndEditRedirections from '../ModalAddAndEditRedirections.page';
import { render, fireEvent, screen } from '@/utils/test.provider';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useGenerateUrl: vi.fn(() => '#/redirections'),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('ModalAddAndEditRedirections Component', () => {
  it('should render correctly', () => {
    render(<ModalAddAndEditRedirections />);

    expect(screen.getByTestId('field-from')).toBeInTheDocument();
    expect(screen.getByTestId('field-to')).toBeInTheDocument();
    expect(screen.getByTestId('field-checkbox')).toBeInTheDocument();

    const confirmButton = screen.getByTestId('confirm-btn');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('should enable the confirm button when form is valid', () => {
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

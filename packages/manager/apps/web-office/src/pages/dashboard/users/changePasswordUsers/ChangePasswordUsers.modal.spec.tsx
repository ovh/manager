import '@testing-library/jest-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ModalChangePasswordUsers from './ChangePasswordUsers.modal';
import { fireEvent, render, act } from '@/utils/test.provider';
import { postUsersPassword } from '@/data/api/users';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalChangePasswordUsers Component', () => {
  it('should enable save button and make API call on valid input in manual mode', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    });

    hoistedMock.useContext.mockReturnValue({
      environment: {
        user: {
          email: 'test@ovhcloud.com',
        },
      },
    });

    const { getByTestId } = render(<ModalChangePasswordUsers />);

    const manualRadio = getByTestId('radio-manual');

    const saveButton = getByTestId('primary-button');
    await act(() => {
      fireEvent.click(manualRadio);
      manualRadio.odsChange.emit({
        value: 'passwordManual',
      });
    });
    const inputPassword = getByTestId('input-password');
    const inputConfirmPassword = getByTestId('input-confirm-password');
    expect(inputPassword).toBeVisible();
    expect(inputConfirmPassword).toBeVisible();

    await act(() => {
      fireEvent.change(inputPassword, { target: { value: 'newPas$word123' } });
      fireEvent.change(inputConfirmPassword, {
        target: { value: 'newPas$word123' },
      });
    });
    expect(saveButton).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(saveButton);
    });
    expect(postUsersPassword).toHaveBeenCalledOnce();
  });

  it('should enable save button and make API call on valid input in automatic mode', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    });

    hoistedMock.useContext.mockReturnValue({
      environment: {
        user: {
          email: 'test@ovhcloud.com',
        },
      },
    });

    const { getByTestId, getByText } = render(<ModalChangePasswordUsers />);

    const automaticRadioSpan = getByText(
      'dashboard_users_change_password_radio_1',
    ).parentElement;
    const emailInput = getByTestId('input-email');
    const saveButton = getByTestId('primary-button');

    await act(() => {
      fireEvent.click(automaticRadioSpan);
    });

    expect(emailInput).toBeVisible();

    await act(() => {
      fireEvent.input(emailInput, { target: { value: 'test@ovhcloud.com' } });
      emailInput.odsChange.emit({ name: 'email', value: 'test@ovhcloud.com' });
    });

    expect(saveButton).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(saveButton);
    });
    expect(postUsersPassword).toHaveBeenCalledOnce();
  });
});

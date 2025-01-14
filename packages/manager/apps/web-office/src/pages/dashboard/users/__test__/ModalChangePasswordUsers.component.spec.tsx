import React from 'react';
import '@testing-library/jest-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ModalChangePasswordUsers from '../ModalChangePasswordUsers.component';
import { fireEvent, render, act } from '@/utils/test.provider';
import { postUsersPassword } from '@/api/users';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalChangePasswordUsers Component', () => {
  it('should enable save button and make API call on valid input', async () => {
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

    const inputPassword = getByTestId('input-password');
    const inputConfirmPassword = getByTestId('input-confirm-password');
    const emailInput = getByTestId('input-email');
    const saveButton = getByTestId('confirm-btn');

    expect(inputPassword).toHaveAttribute('has-error', 'false');
    expect(inputConfirmPassword).toHaveAttribute('has-error', 'false');
    expect(emailInput).toHaveAttribute('has-error', 'false');

    expect(saveButton).toHaveAttribute('is-disabled', 'true');
    await act(() => {
      fireEvent.input(inputPassword, { target: { value: 'newPas$word123' } });
      inputPassword.odsChange.emit({
        name: 'password',
        value: 'newPas$word123',
      });
      fireEvent.input(inputConfirmPassword, {
        target: { value: 'newPas$word123' },
      });
      inputConfirmPassword.odsChange.emit({
        name: 'confirmPassword',
        value: 'newPas$word123',
      });
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

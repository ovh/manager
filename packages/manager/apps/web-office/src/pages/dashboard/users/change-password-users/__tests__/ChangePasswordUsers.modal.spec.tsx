import { useParams, useSearchParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { postUsersPassword } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalChangePasswordUsers from '../ChangePasswordUsers.modal';

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

    const { getByTestId } = renderWithRouter(<ModalChangePasswordUsers />);

    const manualRadio = getByTestId('radio-manual');

    const saveButton = getByTestId('primary-button');

    await act(() => {
      fireEvent.click(manualRadio);
    });
    const inputPassword = getByTestId('input-password');
    expect(inputPassword).toBeVisible();

    await act(() => {
      fireEvent.change(inputPassword, { target: { value: 'newPas$word123' } });
    });
    expect(saveButton).not.toHaveAttribute('disabled');

    await act(() => fireEvent.click(saveButton));
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

    const { getByTestId, getByText } = renderWithRouter(<ModalChangePasswordUsers />);

    const automaticRadioSpan = getByText('dashboard_users_change_password_radio_1').parentElement;
    const emailInput = getByTestId('input-email');
    const saveButton = getByTestId('primary-button');

    await act(() => fireEvent.click(automaticRadioSpan));

    expect(emailInput).toBeVisible();

    await act(() => {
      fireEvent.input(emailInput, { target: { value: 'test@ovhcloud.com' } });
    });

    expect(saveButton).not.toHaveAttribute('disabled');

    await act(() => fireEvent.click(saveButton));
    expect(postUsersPassword).toHaveBeenCalledOnce();
  });
});

describe('ModalChangePasswordUsers W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalChangePasswordUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ModalEditUsers from '../ModalEditUsers.component';
import { fireEvent, render, act } from '@/utils/test.provider';
import { putOfficeLicenseDetails } from '@/api/license';
import { putOfficeUserDetail } from '@/api/users';
import { licensesPrepaidExpandedMock, usersMock } from '@/api/_mock_';

const hoistedMock = vi.hoisted(() => ({
  useOfficeUserDetail: vi.fn(),
}));

vi.mock('@/hooks', async (importActual) => {
  const actual = await importActual<typeof import('@/hooks')>();
  return {
    ...actual,
    useOfficeUserDetail: hoistedMock.useOfficeUserDetail,
  };
});

describe('ModalEditUsers Component', () => {
  it('if prepaid licence with licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
        licencePrepaidName: 'licencePrepaidName',
      }),
      vi.fn(),
    ]);

    hoistedMock.useOfficeUserDetail.mockReturnValue({
      data: usersMock[0],
      isLoading: false,
    });

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('edit-btn');

    expect(inputFirstName).toHaveAttribute('has-error', 'false');
    expect(inputLastName).toHaveAttribute('has-error', 'false');
    expect(inputLogin).toHaveAttribute('has-error', 'false');

    expect(editButton).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.input(inputFirstName, {
        target: {
          value: 'firstname',
        },
      });
      inputFirstName.odsChange.emit({ name: 'firstname', value: 'firstname' });
    });

    expect(editButton).toHaveAttribute('is-disabled', 'false');
    await act(() => {
      fireEvent.click(editButton);
    });

    expect(putOfficeLicenseDetails).toHaveBeenCalledOnce();
  });

  it('if postpaid licence without licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);

    hoistedMock.useOfficeUserDetail.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('edit-btn');

    expect(inputFirstName).toHaveAttribute('has-error', 'false');
    expect(inputLastName).toHaveAttribute('has-error', 'false');
    expect(inputLogin).toHaveAttribute('has-error', 'false');

    expect(editButton).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.input(inputFirstName, {
        target: {
          value: 'firstname',
        },
      });
      inputFirstName.odsChange.emit({ name: 'firstname', value: 'firstname' });
    });

    expect(editButton).toHaveAttribute('is-disabled', 'false');
    await act(() => {
      fireEvent.click(editButton);
    });

    expect(putOfficeUserDetail).toHaveBeenCalledOnce();
  });
});

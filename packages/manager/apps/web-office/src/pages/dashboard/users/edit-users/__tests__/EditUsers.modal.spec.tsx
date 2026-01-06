import { useSearchParams } from 'react-router-dom';

import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { putOfficeLicenseDetails } from '@/data/api/license/api';
import { putOfficeUserDetail } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalEditUsers from '../EditUsers.modal';

const hoistedMock = vi.hoisted(() => ({
  useUserDetail: vi.fn(),
}));

vi.mock('@/data/hooks/user-detail/useUserDetail', async (importActual) => {
  const actual = await importActual<typeof import('@/data/hooks/user-detail/useUserDetail')>();
  return {
    ...actual,
    useUserDetail: hoistedMock.useUserDetail,
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

    hoistedMock.useUserDetail.mockReturnValue({
      data: usersMock[0],
      isLoading: false,
    });

    const { getByTestId } = renderWithRouter(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('primary-button');
    expect(inputFirstName).not.toHaveAttribute('data-invalid');
    expect(inputLastName).not.toHaveAttribute('data-invalid');
    expect(inputLogin).not.toHaveAttribute('data-invalid');

    expect(editButton).toHaveAttribute('disabled');

    await act(() => {
      fireEvent.input(inputFirstName, {
        target: {
          value: 'firstname',
        },
      });
    });
    expect(editButton).not.toHaveAttribute('disabled');
    await act(() => fireEvent.click(editButton));

    expect(putOfficeLicenseDetails).toHaveBeenCalledOnce();
  });

  it('if postpaid licence without licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);

    hoistedMock.useUserDetail.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });

    const { getByTestId } = renderWithRouter(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('primary-button');

    expect(inputFirstName).not.toHaveAttribute('data-invalid');
    expect(inputLastName).not.toHaveAttribute('data-invalid');
    expect(inputLogin).not.toHaveAttribute('data-invalid');

    expect(editButton).toHaveAttribute('disabled');

    await act(() => {
      fireEvent.input(inputFirstName, {
        target: {
          value: 'firstname',
        },
      });
    });

    expect(editButton).not.toHaveAttribute('disabled');
    await act(() => fireEvent.click(editButton));

    expect(putOfficeUserDetail).toHaveBeenCalledOnce();
  });
});

describe('ModalEditUsers W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalEditUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

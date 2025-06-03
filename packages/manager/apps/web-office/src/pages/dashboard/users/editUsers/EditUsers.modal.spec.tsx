import { useSearchParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ModalEditUsers from './EditUsers.modal';
import { fireEvent, render, act } from '@/utils/test.provider';
import { putOfficeLicenseDetails } from '@/data/api/license';
import { putOfficeUserDetail } from '@/data/api/users';
import { licensesPrepaidExpandedMock, usersMock } from '@/data/api/__mocks__';

const hoistedMock = vi.hoisted(() => ({
  useUserDetail: vi.fn(),
}));

vi.mock('@/data/hooks', async (importActual) => {
  const actual = await importActual<typeof import('@/data/hooks')>();
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

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('primary-button');

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

    hoistedMock.useUserDetail.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname');
    const inputLastName = getByTestId('input-lastname');
    const inputLogin = getByTestId('input-login');
    const editButton = getByTestId('primary-button');

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

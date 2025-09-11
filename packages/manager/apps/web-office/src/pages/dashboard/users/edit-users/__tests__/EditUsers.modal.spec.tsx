/* eslint-disable @typescript-eslint/await-thenable */
import { useSearchParams } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { putOfficeLicenseDetails } from '@/data/api/license/api';
import { putOfficeUserDetail } from '@/data/api/users/api';
import { act, fireEvent, render } from '@/utils/Test.provider';
import { OdsHTMLElement } from '@/utils/Test.utils';

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

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname') as OdsHTMLElement;
    const inputLastName = getByTestId('input-lastname') as OdsHTMLElement;
    const inputLogin = getByTestId('input-login') as OdsHTMLElement;
    const editButton = getByTestId('primary-button') as OdsHTMLElement;

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

    const { getByTestId } = render(<ModalEditUsers />);

    const inputFirstName = getByTestId('input-firstname') as OdsHTMLElement;
    const inputLastName = getByTestId('input-lastname') as OdsHTMLElement;
    const inputLogin = getByTestId('input-login') as OdsHTMLElement;
    const editButton = getByTestId('primary-button') as OdsHTMLElement;

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
    await act(() => fireEvent.click(editButton));

    expect(putOfficeUserDetail).toHaveBeenCalledOnce();
  });
});

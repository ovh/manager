import { useSearchParams } from 'react-router-dom';

import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { putOfficeLicenseDetails } from '@/data/api/license/api';
import { putOfficeUserDetail } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';
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
  // You should update according to new DOM
  /*
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/edit-users/__tests__/EditUsers.modal.spec.tsx (3 tests | 2 failed | 1 skipped) 186ms
@ovh-ux/manager-web-office-app:test:    × ModalEditUsers Component > if prepaid licence with licencePrepaidName 161ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("has-error", "false") // element.getAttribute("has-error") === "false"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   has-error="false"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    × ModalEditUsers Component > if postpaid licence without licencePrepaidName 23ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("has-error", "false") // element.getAttribute("has-error") === "false"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   has-error="false"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    ↓ ModalEditUsers W3C Validation > should have a valid html
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/edit-users/__tests__/EditUsers.modal.spec.tsx > ModalEditUsers Component > if prepaid licence with licencePrepaidName
@ovh-ux/manager-web-office-app:test: Error: expect(element).toHaveAttribute("has-error", "false") // element.getAttribute("has-error") === "false"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   has-error="false"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/edit-users/__tests__/EditUsers.modal.spec.tsx:49:28
@ovh-ux/manager-web-office-app:test:      47|     const editButton = getByTestId('primary-button') as OdsHTMLElement;
@ovh-ux/manager-web-office-app:test:      48|
@ovh-ux/manager-web-office-app:test:      49|     expect(inputFirstName).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:        |                            ^
@ovh-ux/manager-web-office-app:test:      50|     expect(inputLastName).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:      51|     expect(inputLogin).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/edit-users/__tests__/EditUsers.modal.spec.tsx > ModalEditUsers Component > if postpaid licence without licencePrepaidName
@ovh-ux/manager-web-office-app:test: Error: expect(element).toHaveAttribute("has-error", "false") // element.getAttribute("has-error") === "false"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   has-error="false"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/edit-users/__tests__/EditUsers.modal.spec.tsx:90:28
@ovh-ux/manager-web-office-app:test:      88|     const editButton = getByTestId('primary-button') as OdsHTMLElement;
@ovh-ux/manager-web-office-app:test:      89|
@ovh-ux/manager-web-office-app:test:      90|     expect(inputFirstName).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:        |                            ^
@ovh-ux/manager-web-office-app:test:      91|     expect(inputLastName).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:      92|     expect(inputLogin).toHaveAttribute('has-error', 'false');
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
   */
  it.skip('if prepaid licence with licencePrepaidName', async () => {
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
      inputFirstName.onChange.emit.skip({ name: 'firstname', value: 'firstname' });
    });

    expect(editButton).toHaveAttribute('is-disabled', 'false');
    await act(() => fireEvent.click(editButton));

    expect(putOfficeLicenseDetails).toHaveBeenCalledOnce();
  });

  it.skip('if postpaid licence without licencePrepaidName', async () => {
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
      inputFirstName.onChange.emit.skip({ name: 'firstname', value: 'firstname' });
    });

    expect(editButton).toHaveAttribute('is-disabled', 'false');
    await act(() => fireEvent.click(editButton));

    expect(putOfficeUserDetail).toHaveBeenCalledOnce();
  });
});

describe('ModalEditUsers W3C Validation', () => {
  // issue with ods on label and input (for / id)
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalEditUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

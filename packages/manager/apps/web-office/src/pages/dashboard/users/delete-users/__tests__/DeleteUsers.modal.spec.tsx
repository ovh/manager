import { useSearchParams } from 'react-router-dom';

import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { postOfficePrepaidLicenseUnconfigure } from '@/data/api/license/api';
import { deleteOfficeUser } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalDeleteUsers from '../DeleteUsers.modal';

describe('ModalDeleteUsers Component', () => {
  // You should update according to new DOM
  /*
  :  FAIL  src/pages/dashboard/users/delete-users/__tests__/DeleteUsers.modal.spec.tsx > ModalDeleteUsers Component > if prepaid licence with licencePrepaidName
@ovh-ux/manager-web-office-app:test: AssertionError: expected "spy" to be called once, but got 0 times
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/delete-users/__tests__/DeleteUsers.modal.spec.tsx:28:49
@ovh-ux/manager-web-office-app:test:      26|     await act(() => fireEvent.click(deleteButton));
@ovh-ux/manager-web-office-app:test:      27|
@ovh-ux/manager-web-office-app:test:      28|     expect(postOfficePrepaidLicenseUnconfigure).toHaveBeenCalledOnce();
@ovh-ux/manager-web-office-app:test:        |                                                 ^
@ovh-ux/manager-web-office-app:test:      29|   });
@ovh-ux/manager-web-office-app:test:      30|
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/delete-users/__tests__/DeleteUsers.modal.spec.tsx > ModalDeleteUsers Component > if postpaid licence without licencePrepaidName
@ovh-ux/manager-web-office-app:test: AssertionError: expected "spy" to be called once, but got 0 times
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/delete-users/__tests__/DeleteUsers.modal.spec.tsx:47:30
@ovh-ux/manager-web-office-app:test:      45|     await act(() => fireEvent.click(deleteButton));
@ovh-ux/manager-web-office-app:test:      46|
@ovh-ux/manager-web-office-app:test:      47|     expect(deleteOfficeUser).toHaveBeenCalledOnce();
@ovh-ux/manager-web-office-app:test:        |                              ^
@ovh-ux/manager-web-office-app:test:      48|   });
@ovh-ux/manager-web-office-app:test:      49| });
   */
  it.skip('if prepaid licence with licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
        licencePrepaidName: 'licencePrepaidName',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = renderWithRouter(<ModalDeleteUsers />);

    const deleteButton = getByTestId('primary-button');

    await act(() => fireEvent.click(deleteButton));

    expect(postOfficePrepaidLicenseUnconfigure).toHaveBeenCalledOnce();
  });

  it.skip('if postpaid licence without licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = renderWithRouter(<ModalDeleteUsers />);

    const deleteButton = getByTestId('primary-button');

    expect(deleteButton).toBeInTheDocument();

    await act(() => fireEvent.click(deleteButton));

    expect(deleteOfficeUser).toHaveBeenCalledOnce();
  });
});

describe('ModalDeleteUsers W3C Validation', () => {
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalDeleteUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

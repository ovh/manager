import { useSearchParams } from 'react-router-dom';

import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { postOfficePrepaidLicenseUnconfigure } from '@/data/api/license/api';
import { deleteOfficeUser } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalDeleteUsers from '../DeleteUsers.modal';

describe('ModalDeleteUsers Component', () => {
  it('if prepaid licence with licencePrepaidName', async () => {
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

  it('if postpaid licence without licencePrepaidName', async () => {
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
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalDeleteUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

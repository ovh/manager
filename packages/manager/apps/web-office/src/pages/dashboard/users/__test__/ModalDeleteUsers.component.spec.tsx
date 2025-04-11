import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import ModalDeleteUsers from '../ModalDeleteUsers.component';
import { fireEvent, render, act } from '@/utils/test.provider';
import { postOfficePrepaidLicenseUnconfigure } from '@/api/license';
import { deleteOfficeUser } from '@/api/users';

describe('ModalDeleteUsers Component', () => {
  it('if prepaid licence with licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
        licencePrepaidName: 'licencePrepaidName',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<ModalDeleteUsers />);

    const deleteButton = getByTestId('delete-btn');

    await act(() => {
      fireEvent.click(deleteButton);
    });

    expect(postOfficePrepaidLicenseUnconfigure).toHaveBeenCalledOnce();
  });

  it('if postpaid licence without licencePrepaidName', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<ModalDeleteUsers />);

    const deleteButton = getByTestId('delete-btn');

    expect(deleteButton).toBeInTheDocument();

    await act(() => {
      fireEvent.click(deleteButton);
    });

    expect(deleteOfficeUser).toHaveBeenCalledOnce();
  });
});

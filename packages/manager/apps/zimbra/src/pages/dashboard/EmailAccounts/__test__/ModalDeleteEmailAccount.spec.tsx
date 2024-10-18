import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, act } from '@/utils/test.provider';
import { domainDetailMock } from '@/api/_mock_';
import ModalDeleteEmailAccount from '../ModalDeleteEmailAccount.component';
import accountsDeleteTranslation from '@/public/translations/accounts/delete/Messages_fr_FR.json';
import { deleteZimbraPlatformAccount } from '@/api/account';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    deleteDomainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domains delete modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteEmailAccount />);
    expect(getByTestId('modal')).toHaveProperty(
      'headline',
      accountsDeleteTranslation.zimbra_account_delete_modal_title,
    );
  });

  it('check transition from step 1 to step 2 and delete', async () => {
    const { getByTestId } = render(<ModalDeleteEmailAccount />);
    expect(getByTestId('text-step-1')).toBeVisible();
    await act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(getByTestId('text-step-2')).toBeVisible();

    await act(() => {
      fireEvent.click(getByTestId('primary-btn'));
    });

    expect(deleteZimbraPlatformAccount).toHaveBeenCalledOnce();
  });
});

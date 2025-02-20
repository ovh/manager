import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render, waitFor, act, fireEvent } from '@/utils/test.provider';
import ModalDeleteDomain from '../ModalDeleteDomain.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { getZimbraPlatformAccounts } from '@/api/account';
import { deleteZimbraPlatformDomain } from '@/api/domain';
import { domainDetailMock } from '@/api/_mock_';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    deleteDomainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domains delete modal', () => {
  it('check if it is displayed', async () => {
    const { findByText } = render(<ModalDeleteDomain />);
    expect(await findByText(commonTranslation.delete_domain)).toBeVisible();
  });

  it('if have email use the domain', async () => {
    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toHaveAttribute('is-disabled', 'true');
  });

  it('if there is not email use the domain', async () => {
    vi.mocked(getZimbraPlatformAccounts).mockReturnValue({ data: [] });
    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const btn = getByTestId('delete-btn');

    expect(queryByTestId('banner-message')).toBeNull();
    expect(btn).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(btn);
    });

    expect(deleteZimbraPlatformDomain).toHaveBeenCalledOnce();
  });
});

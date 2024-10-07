import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render, waitFor, act, fireEvent } from '@/utils/test.provider';
import ModalDeleteDomain from '../ModalDeleteDomain.component';
import domainsDeleteTranslation from '@/public/translations/domains/delete/Messages_fr_FR.json';
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
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteDomain />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainsDeleteTranslation.zimbra_domain_delete_modal_title,
    );
  });

  it('if have email use the domain', async () => {
    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toBeDisabled();
  });

  it('if there is not email use the domain', async () => {
    vi.mocked(getZimbraPlatformAccounts).mockReturnValue([]);
    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const btn = getByTestId('delete-btn');

    expect(queryByTestId('banner-message')).toBeNull();
    expect(btn).toBeEnabled();

    await act(() => {
      fireEvent.click(btn);
    });

    expect(deleteZimbraPlatformDomain).toHaveBeenCalledOnce();
  });
});

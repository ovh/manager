import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { render, waitFor, act, fireEvent } from '@/utils/test.provider';
import ModalDeleteDomain from '../ModalDeleteDomain.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { getZimbraPlatformAccounts } from '@/api/account';
import { deleteZimbraPlatformDomain } from '@/api/domain';
import { domainDetailMock, platformMock } from '@/api/_mock_';

describe('Domain delete modal', () => {
  it('should render correctly', async () => {
    const { findByText } = render(<ModalDeleteDomain />);
    expect(await findByText(commonTranslation.delete_domain)).toBeVisible();
  });

  it('should prevent deletion if there is linked emails', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      domainId: domainDetailMock.id,
    });

    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toHaveAttribute('is-disabled', 'true');
  });

  it('should not prevent deletion if there is no linked emails', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      domainId: '0',
    });

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

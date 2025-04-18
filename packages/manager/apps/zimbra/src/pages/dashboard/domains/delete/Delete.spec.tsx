import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';
import { render, waitFor, act, fireEvent } from '@/utils/test.provider';
import DeleteDomainModal from './Delete.modal';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import {
  getZimbraPlatformAccounts,
  deleteZimbraPlatformDomain,
  domainMock,
  platformMock,
  AccountType,
} from '@/data/api';

describe('Domain delete modal', () => {
  it('should render correctly', async () => {
    const { findByText } = render(<DeleteDomainModal />);
    expect(await findByText(commonTranslation.delete_domain)).toBeVisible();
  });

  it('should prevent deletion if there is linked emails', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      domainId: domainMock.id,
    });

    const { getByTestId, queryByTestId } = render(<DeleteDomainModal />);

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

    vi.mocked(getZimbraPlatformAccounts).mockResolvedValue({
      data: [],
    } as IcebergFetchResultV2<AccountType[]>);

    const { getByTestId, queryByTestId } = render(<DeleteDomainModal />);

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

import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';

import {
  AccountType,
  deleteZimbraPlatformDomain,
  domainMock,
  getZimbraPlatformAccounts,
  platformMock,
} from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import DeleteDomainModal from './Delete.modal';

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

    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });

    expect(deleteZimbraPlatformDomain).toHaveBeenCalledOnce();
  });
});

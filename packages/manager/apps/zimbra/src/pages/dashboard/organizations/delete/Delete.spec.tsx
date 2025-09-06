import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';

import {
  DomainType,
  deleteZimbraPlatformOrganization,
  getZimbraPlatformDomains,
  organizationMock,
  platformMock,
} from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import DeleteOrganizationModal from './Delete.modal';

describe('DeleteOrganization modal', () => {
  it('should render modal', () => {
    const { findByText } = render(<DeleteOrganizationModal />);
    expect(findByText(commonTranslation.delete_organization)).toBeDefined();
  });

  it('should have button disabled if domains', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      organizationId: organizationMock.id,
    });

    const { getByTestId, queryByTestId } = render(<DeleteOrganizationModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toHaveAttribute('is-disabled', 'true');
  });

  it('should delete org if no domains and clicked', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      organizationId: '0',
    });

    vi.mocked(getZimbraPlatformDomains).mockResolvedValue({
      data: [],
    } as IcebergFetchResultV2<DomainType[]>);

    const { getByTestId, queryByTestId } = render(<DeleteOrganizationModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('delete-btn');

    expect(queryByTestId('banner-message')).toBeNull();
    expect(button).toHaveAttribute('is-disabled', 'false');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(button);
    });

    expect(deleteZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

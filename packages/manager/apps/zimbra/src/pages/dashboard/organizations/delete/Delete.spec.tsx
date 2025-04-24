import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';
import { render, waitFor, fireEvent, act } from '@/utils/test.provider';
import DeleteOrganizationModal from './Delete.modal';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import {
  organizationMock,
  platformMock,
  deleteZimbraPlatformOrganization,
  getZimbraPlatformDomains,
  DomainType,
} from '@/data/api';

describe('DeleteOrganization modal', () => {
  it('should render modal', async () => {
    const { findByText } = render(<DeleteOrganizationModal />);
    expect(
      await findByText(commonTranslation.delete_organization),
    ).toBeVisible();
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

    await act(() => {
      fireEvent.click(button);
    });

    expect(deleteZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

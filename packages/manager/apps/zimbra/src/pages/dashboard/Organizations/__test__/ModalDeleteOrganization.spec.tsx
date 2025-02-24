import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render, waitFor, fireEvent, act } from '@/utils/test.provider';
import ModalDeleteOrganization from '../ModalDeleteOrganization.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';
import { deleteZimbraPlatformOrganization } from '@/api/organization';
import { getZimbraPlatformDomains } from '@/api/domain';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    deleteOrganizationId: organizationDetailMock.id,
  }),
  vi.fn(),
]);

describe('Organizations delete modal', () => {
  it('should render modal', async () => {
    const { findByText } = render(<ModalDeleteOrganization />);
    expect(
      await findByText(commonTranslation.delete_organization),
    ).toBeVisible();
  });

  it('should have button disabled if domains', async () => {
    const { getByTestId, queryByTestId } = render(<ModalDeleteOrganization />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toHaveAttribute('is-disabled', 'true');
  });

  it('should delete org if no domains and clicked', async () => {
    vi.mocked(getZimbraPlatformDomains).mockReturnValue({ data: [] });

    const { getByTestId, queryByTestId } = render(<ModalDeleteOrganization />);

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

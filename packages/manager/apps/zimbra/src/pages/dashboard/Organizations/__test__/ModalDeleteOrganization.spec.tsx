import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render, waitFor, fireEvent, act } from '@/utils/test.provider';
import ModalDeleteOrganization from '../ModalDeleteOrganization.component';
import organizationsDeleteTranslation from '@/public/translations/organizations/delete/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';
import { getZimbraPlatformDomains } from '@/api/domain';
import { deleteZimbraPlatformOrganization } from '@/api/organization';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    deleteOrganizationId: organizationDetailMock.id,
  }),
  vi.fn(),
]);

describe('Organizations delete modal', () => {
  it('should render modal', () => {
    const { getByTestId } = render(<ModalDeleteOrganization />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      organizationsDeleteTranslation.zimbra_organization_delete_modal_title,
    );
  });

  it('should have button disabled if domains', async () => {
    const { getByTestId, queryByTestId } = render(<ModalDeleteOrganization />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toBeDisabled();
  });

  it('should delete org if no domains and clicked', async () => {
    vi.mocked(getZimbraPlatformDomains).mockResolvedValue([]);

    const { getByTestId, queryByTestId } = render(<ModalDeleteOrganization />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(queryByTestId('banner-message')).toBeNull();
    expect(getByTestId('delete-btn')).not.toBeDisabled();

    await act(() => {
      fireEvent.click(getByTestId('delete-btn'));
    });

    expect(deleteZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

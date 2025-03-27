import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { organisationMockDetails } from '../../../../mocks';
import { ManageOrganisationsDatagrid } from './components/OrganisationsDatagrid/manageOrganisationsDataGrid.component';

const queryClient = new QueryClient();

/** MOCKS */
const useGetOrgListDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ organisationMockDetails, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/organisation', () => ({
  useGetOrganisationsDetails: useGetOrgListDetailsMock,
}));

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ManageOrganisationsDatagrid />
    </QueryClientProvider>,
  );
};

describe('Manage Organisations Page', () => {
  it('Should display columns', async () => {
    useGetOrgListDetailsMock.mockReturnValue({
      organisationMockDetails,
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent();
    await waitFor(() => {
      expect(getByText('manageOrganisationsTabOrganisaton')).toBeDefined();
      expect(getByText('manageOrganisationsTabType')).toBeDefined();
      expect(getByText('manageOrganisationsTabSurname')).toBeDefined();
      expect(getByText('manageOrganisationsTabEmail')).toBeDefined();
      expect(getByText('manageOrganisationsTabPhone')).toBeDefined();
      expect(getByText('manageOrganisationsTabAddress')).toBeDefined();
    });
  });
});

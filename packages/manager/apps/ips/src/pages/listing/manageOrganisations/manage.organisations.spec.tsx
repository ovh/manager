import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { organisationMockDetails } from '@/__mocks__';

import { ManageOrganisationsDatagrid } from './components/OrganisationsDatagrid/manageOrganisationsDataGrid.component';

const queryClient = new QueryClient();

/** MOCKS */
const useGetOrgListDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ organisationMockDetails, loading: true, error: undefined })),
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
      loading: false,
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

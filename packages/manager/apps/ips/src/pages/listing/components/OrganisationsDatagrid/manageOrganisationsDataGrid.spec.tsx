import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import orgList from '../../../../../mocks/organisations/get-organisations.json';
import { ManageOrganisationsDatagrid } from './manageOrganisationsDataGrid.component';

const queryClient = new QueryClient();

/** MOCKS */
const useGetOrgListMock = vi.hoisted(() =>
  vi.fn(() => ({ orgList, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/organisation', () => ({
  useGetOrganisationsList: useGetOrgListMock,
}));

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ManageOrganisationsDatagrid />
    </QueryClientProvider>,
  );
};

vi.mock('../DatagridCells', () => ({
  OrganisationsIdCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsTypeCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsSurnameCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsEmailCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsPhoneCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsAddressCell: ({ org }: { org: string }) => <div>{org}</div>,
  OrganisationsActionsCell: ({ org }: { org: string }) => <div>{org}</div>,
}));

describe('manageOrganisationsDatagrid Component', async () => {
  it('Should display columns', async () => {
    useGetOrgListMock.mockReturnValue({
      orgList,
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

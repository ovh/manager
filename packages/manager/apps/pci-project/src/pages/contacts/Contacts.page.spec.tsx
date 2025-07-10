/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as pciCommon from '@ovh-ux/manager-pci-common';
import ContactsPage from './Contacts.page';
import { createWrapper, shellContext } from '@/wrapperRenders';
import { useProjectService } from '@/data/hooks/useServices';
import { useProjectAcl, useProjectAclAccountsInfo } from '@/data/hooks/useAcl';
import { getDatagridColumns } from './datagrid-columns';

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  return {
    ...actual,
    OdsButton: ({ label, ...props }: { label: string }) => (
      <button data-testid="ods-button" {...props}>
        {label}
      </button>
    ),
    OdsText: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="ods-text" {...props}>
        {children}
      </div>
    ),
    OdsLink: ({
      label,
      iconAlignment, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...props
    }: {
      label: string;
      iconAlignment?: string;
    }) => (
      <a data-testid="ods-link" {...props}>
        {label}
      </a>
    ),
    OdsSpinner: () => <div data-testid="ods-spinner" />,
  };
});

vi.mock('./datagrid-columns', () => ({
  getDatagridColumns: vi.fn(),
}));

vi.mock('@/data/hooks/useServices', () => ({
  useProjectService: vi.fn(),
}));

vi.mock('@/data/hooks/useAcl', () => ({
  useProjectAcl: vi.fn(),
  useProjectAclAccountsInfo: vi.fn(),
}));

vi.mock('@/hooks/useParam', () => ({
  useParam: vi.fn().mockReturnValue('p-1'),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackClick: vi.fn(),
      trackPage: vi.fn(),
    }),
  };
});

const wrapper = createWrapper();

const projectMock = { project_id: 'p-1', description: 'My project' } as any;

describe('ContactsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(pciCommon, 'useProject').mockReturnValue({
      data: projectMock,
    } as any);
    vi.mocked(useProjectService).mockReturnValue({
      data: {
        serviceId: 'svc-1',
        contactAdmin: 'abc123',
        contactBilling: 'bill123',
      },
    } as any);
    vi.mocked(useProjectAcl).mockReturnValue({ data: ['u1', 'u2'] } as any);
    vi.mocked(useProjectAclAccountsInfo).mockReturnValue([
      { accountId: 'u1' },
      { accountId: 'u2' },
    ] as any);
    vi.mocked(getDatagridColumns).mockReturnValue([] as any);
    vi.spyOn(pciCommon, 'isDiscoveryProject').mockReturnValue(false as any);
  });

  it('shows spinner while data is loading', () => {
    vi.spyOn(pciCommon, 'useProject').mockReturnValue({
      data: undefined,
    } as any);
    render(<ContactsPage />, { wrapper });
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('renders layout, breadcrumbs and datagrid when data loaded', () => {
    render(<ContactsPage />, { wrapper });
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getAllByTestId('ods-text').length).toBeGreaterThan(0);
    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
  });

  it('shows add button when user is admin', () => {
    const adminContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ ovhSubsidiary: 'FR', nichandle: 'abc123' }),
      },
    } as any;
    const adminWrapper = createWrapper(adminContext);
    render(<ContactsPage />, { wrapper: adminWrapper });
    expect(screen.getByTestId('ods-button')).toBeInTheDocument();
    expect(screen.getByTestId('ods-button')).toHaveTextContent('common_add');
  });

  it('hides add button when user is not admin', () => {
    const nonAdminContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ ovhSubsidiary: 'FR', nichandle: 'someoneelse' }),
      },
    } as any;
    vi.mocked(useProjectService).mockReturnValue({
      data: {
        serviceId: 'svc-1',
        contactAdmin: 'admin1',
        contactBilling: 'bill123',
      },
    } as any);
    const customWrapper = createWrapper(nonAdminContext);
    render(<ContactsPage />, { wrapper: customWrapper });
    expect(screen.queryByTestId('ods-button')).not.toBeInTheDocument();
  });

  it('shows modify links only when EU region and not discovery project', async () => {
    vi.spyOn(pciCommon, 'isDiscoveryProject').mockReturnValue(false as any);
    render(<ContactsPage />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByTestId('ods-link').length).toBeGreaterThan(0);
    });
  });
});

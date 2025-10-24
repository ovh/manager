import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ListingPage from './Listing.page';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nasha_listing_title': 'NAS-HA Services',
        'nasha_listing_order': 'Order a HA-NAS',
        'nasha_listing_serviceName': 'Service ID',
        'nasha_listing_customName': 'Name',
        'nasha_listing_datacenter': 'Datacentre location',
        'nasha_listing_diskType': 'Disk type',
        'nasha_listing_canCreatePartition': 'Partition creation',
        'nasha_listing_canCreatePartition_true': 'Allowed',
        'nasha_listing_canCreatePartition_false': 'Not allowed',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock tracking
const mockTrackClick = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick: mockTrackClick }),
}));

// Mock API hook
vi.mock('@/data/api/hooks/useNashaServices', () => ({
  useNashaServices: vi.fn(),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ header, children }: any) => (
    <div>
      <h1>{header.title}</h1>
      <div data-testid="header-actions">{header.actions}</div>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant }: any) => (
    <button
      data-testid="button"
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Datagrid: ({ columns, data, totalItems, pagination, sorting, onPaginationChange, onSortChange, isLoading }: any) => (
    <div data-testid="datagrid">
      <div data-testid="datagrid-loading">{isLoading ? 'Loading...' : 'Loaded'}</div>
      <div data-testid="datagrid-total">{totalItems}</div>
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.id}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index}>
              {columns.map((col: any) => (
                <td key={col.id}>
                  {col.cell ? col.cell({ row: { original: item } }) : item[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  useDataGrid: () => ({
    pagination: { pageIndex: 0, pageSize: 25 },
    sorting: null,
    onPaginationChange: vi.fn(),
    onSortChange: vi.fn(),
  }),
}));

import { useNashaServices } from '@/data/api/hooks/useNashaServices';

const mockUseNashaServices = useNashaServices as any;

describe('ListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders listing page with header', () => {
    mockUseNashaServices.mockReturnValue({
      data: { data: [], totalCount: 0 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('NAS-HA Services')).toBeInTheDocument();
    expect(screen.getByText('Order a HA-NAS')).toBeInTheDocument();
  });

  it('renders datagrid with data', () => {
    const mockData = [
      {
        serviceName: 'nasha-123',
        customName: 'My NAS',
        datacenter: 'GRA11',
        diskType: 'SSD',
        canCreatePartition: true,
      },
    ];

    mockUseNashaServices.mockReturnValue({
      data: { data: mockData, totalCount: 1 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    expect(screen.getByText('nasha-123')).toBeInTheDocument();
    expect(screen.getByText('My NAS')).toBeInTheDocument();
    expect(screen.getByText('GRA11')).toBeInTheDocument();
    expect(screen.getByText('SSD')).toBeInTheDocument();
    expect(screen.getByText('Allowed')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseNashaServices.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles order button click', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    mockUseNashaServices.mockReturnValue({
      data: { data: [], totalCount: 0 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    const orderButton = screen.getByText('Order a HA-NAS');
    fireEvent.click(orderButton);

    expect(mockTrackClick).toHaveBeenCalledWith('listing::add');
    expect(mockOpen).toHaveBeenCalledWith('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  });

  it('handles service click', () => {
    const mockData = [
      {
        serviceName: 'nasha-123',
        customName: 'My NAS',
        datacenter: 'GRA11',
        diskType: 'SSD',
        canCreatePartition: true,
      },
    ];

    mockUseNashaServices.mockReturnValue({
      data: { data: mockData, totalCount: 1 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    const serviceLink = screen.getByText('nasha-123');
    fireEvent.click(serviceLink);

    expect(mockTrackClick).toHaveBeenCalledWith('listing::service-link');
    expect(mockNavigate).toHaveBeenCalledWith('/bmc-nasha/nasha-123');
  });

  it('displays correct column headers', () => {
    mockUseNashaServices.mockReturnValue({
      data: { data: [], totalCount: 0 },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ListingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Service ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Datacentre location')).toBeInTheDocument();
    expect(screen.getByText('Disk type')).toBeInTheDocument();
    expect(screen.getByText('Partition creation')).toBeInTheDocument();
  });
});
